import { useEffect } from 'react';
import { useAppDispatch } from './index';
import { addMessage, updateMessage, removeMessage } from '@store/slices/messagesSlice';
import { IChatMessage } from '@types/index';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws';
const RECONNECT_DELAY_MS = 3000;

interface WSEnvelope {
  type: string;
  payload?: unknown;
}

/**
 * Live message events from the backend WebSocket (`GET /ws?token=<jwt>`).
 * The wire format is {type, payload}; message payloads match IChatMessage.
 * Pass enabled=false until the user is authenticated.
 */
export const useChatSocket = (enabled: boolean) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) return;

    let socket: WebSocket | null = null;
    let disposed = false;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

      socket.onmessage = (event) => {
        let envelope: WSEnvelope;
        try {
          envelope = JSON.parse(event.data);
        } catch {
          return;
        }

        switch (envelope.type) {
          case 'receive':
          case 'sent': {
            const message = envelope.payload as IChatMessage;
            dispatch(addMessage({ conversationId: message.conversationId, message }));
            break;
          }
          case 'edit':
          case 'reaction': {
            const message = envelope.payload as IChatMessage;
            dispatch(updateMessage({ conversationId: message.conversationId, message }));
            break;
          }
          case 'delete': {
            const payload = envelope.payload as { conversationId: string; messageId: string };
            dispatch(
              removeMessage({
                conversationId: payload.conversationId,
                messageId: payload.messageId,
              })
            );
            break;
          }
        }
      };

      socket.onclose = () => {
        if (!disposed) {
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };
    };

    connect();

    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [dispatch, enabled]);
};
