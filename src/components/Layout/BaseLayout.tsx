import React from 'react';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const layoutStyles = css`
  display: grid;
  grid-template-columns: 60px 360px 1fr;
  height: 100vh;
  background-color: ${theme.colors.white};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 60px 1fr;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return <div className={layoutStyles}>{children}</div>;
};
