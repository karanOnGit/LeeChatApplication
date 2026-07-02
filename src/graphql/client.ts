import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';

const getToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// Headers are resolved per request so a login/logout in the current session
// takes effect immediately, without recreating the client.
export const graphqlClient = new GraphQLClient(endpoint, {
  headers: (): Record<string, string> => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};
