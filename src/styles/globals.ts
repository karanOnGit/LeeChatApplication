import { css } from '@emotion/css';
import { theme } from './theme';

export const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.white};
    color: ${theme.colors.gray[900]};
    line-height: 1.5;
  }

  a {
    color: ${theme.colors.primary[600]};
    text-decoration: none;
    transition: color 150ms ease-in-out;

    &:hover {
      color: ${theme.colors.primary[700]};
    }

    &:focus-visible {
      outline: 2px solid ${theme.colors.primary[500]};
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  button {
    font-family: inherit;
  }

  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  h1 {
    font-size: ${theme.fontSize['3xl']};
    font-weight: ${theme.fontWeight.bold};
  }

  h2 {
    font-size: ${theme.fontSize['2xl']};
    font-weight: ${theme.fontWeight.semibold};
  }

  h3 {
    font-size: ${theme.fontSize.xl};
    font-weight: ${theme.fontWeight.semibold};
  }

  code,
  pre {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray[400]};
    border-radius: 4px;

    &:hover {
      background: ${theme.colors.gray[500]};
    }
  }
`;
