import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { setMessages, setMessageLoading, setMessageError } from '@store/slices/messagesSlice';
import { chatGraphQLService } from '@services/graphql/chatService';

interface UseFetchMessagesOptions {
  conversationId: string;
  limit?: number;
  skip?: boolean;
}

export const useFetchMessages = ({
  conversationId,
  limit = 50,
  skip = false,
}: UseFetchMessagesOptions) => {
  const dispatch = useAppDispatch();
  const { byConversationId, loading, error } = useAppSelector((state) => state.messages);
  const messages = byConversationId[conversationId] || [];

  useEffect(() => {
    if (skip || !conversationId) return;

    const fetchMessages = async () => {
      dispatch(setMessageLoading({ conversationId, loading: true }));
      try {
        const msgs = await chatGraphQLService.getMessages({ conversationId, limit });
        dispatch(setMessages({ conversationId, messages: msgs }));
        dispatch(setMessageError({ conversationId, error: null }));
      } catch (err) {
        dispatch(
          setMessageError({
            conversationId,
            error: err instanceof Error ? err.message : 'Failed to fetch messages',
          })
        );
      } finally {
        dispatch(setMessageLoading({ conversationId, loading: false }));
      }
    };

    fetchMessages();
  }, [dispatch, conversationId, limit, skip]);

  return {
    messages,
    loading: loading[conversationId] || false,
    error: error[conversationId] || null,
  };
};
