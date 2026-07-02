import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { setUser, setToken } from '@store/slices/authSlice';
import { setAuthToken } from '@graphql/client';
import { authAPI } from '@services/api/authAPI';

const pageStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${theme.colors.gray[50]};
`;

const cardStyles = css`
  width: 100%;
  max-width: 380px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const titleStyles = css`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  text-align: center;
`;

const inputStyles = css`
  padding: ${theme.spacing[3]};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary[600]};
  }
`;

const buttonStyles = css`
  padding: ${theme.spacing[3]};
  background-color: ${theme.colors.primary[600]};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const toggleStyles = css`
  background: none;
  border: none;
  color: ${theme.colors.primary[600]};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  text-align: center;
`;

const errorStyles = css`
  color: ${theme.colors.error[600]};
  font-size: ${theme.fontSize.sm};
  text-align: center;
`;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result =
        mode === 'login'
          ? await authAPI.login(username, password)
          : await authAPI.signup(name, username, password);

      setAuthToken(result.token);
      dispatch(setToken(result.token));
      dispatch(setUser(result.user));
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`LeeChat - ${mode === 'login' ? 'Log in' : 'Sign up'}`}</title>
      </Head>

      <div className={pageStyles}>
        <form className={cardStyles} onSubmit={handleSubmit}>
          <h1 className={titleStyles}>LeeChat</h1>

          {mode === 'signup' && (
            <input
              className={inputStyles}
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className={inputStyles}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            className={inputStyles}
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />

          {error && <div className={errorStyles}>{error}</div>}

          <button className={buttonStyles} type="submit" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>

          <button
            className={toggleStyles}
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError(null);
            }}
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Log in'}
          </button>
        </form>
      </div>
    </>
  );
}
