import { IUser } from '@localTypes/index';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface IAuthResult {
  token: string;
  user: IUser;
}

async function authRequest(path: string, body: Record<string, string>): Promise<IAuthResult> {
  const response = await fetch(`${BASE_URL}/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.success) {
    throw new Error(json?.error || `Authentication failed (${response.status})`);
  }
  return json.data as IAuthResult;
}

export const authAPI = {
  login: (username: string, password: string) => authRequest('login', { username, password }),
  signup: (name: string, username: string, password: string) =>
    authRequest('signup', { name, username, password }),
};
