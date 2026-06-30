import React from 'react';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import Link from 'next/link';

const sidebarStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  background-color: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.gray[200]};
  padding: ${theme.spacing[3]} 0;
  gap: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const navGroupStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const iconButtonStyles = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.lg};
  background-color: transparent;
  color: ${theme.colors.gray[700]};
  cursor: pointer;
  transition: ${theme.transitions.fast};
  border: none;
  font-size: 20px;

  &:hover {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.primary[600]};
  }

  &.active {
    background-color: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[600]};
  }
`;

interface SidebarProps {
  activeRoute?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeRoute = '/' }) => {
  const navItems = [
    { icon: '🏠', href: '/', label: 'Home' },
    { icon: '▶️', href: '/videos', label: 'Videos' },
    { icon: '🔥', href: '/trending', label: 'Trending' },
    { icon: '🔍', href: '/search', label: 'Search' },
    { icon: '❤️', href: '/likes', label: 'Likes' },
  ];

  const bottomItems = [
    { icon: '👤', href: '/profile', label: 'Profile' },
    { icon: '⚙️', href: '/settings', label: 'Settings' },
  ];

  return (
    <aside className={sidebarStyles}>
      <div className={navGroupStyles}>
        <Link href="/" className={`${iconButtonStyles} ${activeRoute === '/' ? 'active' : ''}`}>
          📱
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${iconButtonStyles} ${activeRoute === item.href ? 'active' : ''}`}
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </div>

      <div className={navGroupStyles}>
        <button className={iconButtonStyles} title="Create">
          ➕
        </button>
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${iconButtonStyles} ${activeRoute === item.href ? 'active' : ''}`}
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
        <button className={iconButtonStyles} title="Menu">
          ☰
        </button>
      </div>
    </aside>
  );
};
