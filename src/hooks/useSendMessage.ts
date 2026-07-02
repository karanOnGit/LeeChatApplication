import { useCallback } from 'react';
import { useAppDispatch } from './index';
import { addMessage, setMessageError } from '@store/slices/messagesSlice';
import { updateConversation } from '@store/slices/chatSlice';
import { chatGraphQLService } from '@services/graphql/chatService';
import { IChatMessage } from '@localTypes/index';

interface SendMessageParams {
  conversationId: string;
  content: string;
  attachments?: File[];
  replyTo?: string;
}

export const useSendMessage = () => {
  const dispatch = useAppDispatch();

  const sendMessage = useCallback(
    async (params: SendMessageParams) => {
      try {
        const message: IChatMessage = await chatGraphQLService.sendMessage({
          conversationId: params.conversationId,
          content: params.content,
          replyTo: params.replyTo,
        });

        dispatch(addMessage({ conversationId: params.conversationId, message }));
        dispatch(
          updateConversation({
            id: params.conversationId,
            lastMessage: message,
            lastMessageAt: message.createdAt,
            unreadCount: 0,
            isPinned: false,
            isMuted: false,
            participants: [],
            isGroup: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        );
        dispatch(setMessageError({ conversationId: params.conversationId, error: null }));

        return message;
      } catch (err) {
        dispatch(
          setMessageError({
            conversationId: params.conversationId,
            error: err instanceof Error ? err.message : 'Failed to send message',
          })
        );
        throw err;
      }
    },
    [dispatch]
  );

  return { sendMessage };
};
