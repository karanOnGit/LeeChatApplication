import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/api/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
  }
}

export const setAuthToken = (token: string) => {
  graphqlClient.setHeader('Authorization', `Bearer ${token}`);
};

export const clearAuthToken = () => {
  graphqlClient.setHeader('Authorization', '');
};
