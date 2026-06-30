import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { setConversations, setLoading, setError } from '@store/slices/chatSlice';
import { chatGraphQLService } from '@services/graphql/chatService';

interface UseFetchChatsOptions {
  filter?: 'messages' | 'requests';
  limit?: number;
  skip?: boolean;
}

export const useFetchChats = ({ filter = 'messages', limit = 50, skip = false }: UseFetchChatsOptions = {}) => {
  const dispatch = useAppDispatch();
  const { conversations, loading, error } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (skip) return;

    const fetchChats = async () => {
      dispatch(setLoading(true));
      try {
        const chats = await chatGraphQLService.getChats({ filter, limit });
        dispatch(setConversations(chats));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch chats'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchChats();
  }, [dispatch, filter, limit, skip]);

  return { conversations, loading, error };
};
