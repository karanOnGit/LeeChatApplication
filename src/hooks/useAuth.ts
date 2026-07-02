import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from './index';
import { setUser, setToken } from '@store/slices/authSlice';
import { clearAuthToken } from '@graphql/client';
import { chatGraphQLService } from '@services/graphql/chatService';

/**
 * Page guard: redirects to /login when there is no token, otherwise loads
 * the current user from the backend into the auth slice. An invalid or
 * expired token is cleared and also redirects to /login.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    if (user) return;

    dispatch(setToken(token));
    chatGraphQLService
      .getCurrentUser()
      .then((currentUser) => dispatch(setUser(currentUser)))
      .catch(() => {
        clearAuthToken();
        router.replace('/login');
      });
  }, [dispatch, router, user]);

  return { user, isAuthenticated };
};
