import { css } from '@emotion/css';

export const atoms = {
  flexCenter: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  flexBetween: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  flexStart: css`
    display: flex;
    align-items: flex-start;
  `,
  flexColumn: css`
    display: flex;
    flex-direction: column;
  `,
  flexColumnCenter: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
  gridCenter: css`
    display: grid;
    place-items: center;
  `,
  truncate: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  truncateLine: (lines: number) => css`
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,
  fullWidth: css`
    width: 100%;
  `,
  fullHeight: css`
    height: 100%;
  `,
  srOnly: css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `,
  transition: (property = 'all', duration = '300ms', timing = 'ease-in-out') => css`
    transition: ${property} ${duration} ${timing};
  `,
  shadow: {
    sm: css`
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    `,
    base: css`
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    `,
    md: css`
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    `,
    lg: css`
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    `,
    xl: css`
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    `,
  },
  focus: css`
    outline: 2px solid transparent;
    outline-offset: 2px;
    &:focus-visible {
      outline: 2px solid #4f46e5;
      outline-offset: 2px;
    }
  `,
  resetButton: css`
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
};
