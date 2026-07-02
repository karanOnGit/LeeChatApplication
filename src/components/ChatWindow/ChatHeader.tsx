import React from 'react';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { IChat } from '@localTypes/index';

const headerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[100]};
  background-color: ${theme.colors.white};
`;

const chatInfoStyles = css`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const avatarStyles = css`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
`;

const detailsStyles = css`
  display: flex;
  flex-direction: column;
`;

const nameStyles = css`
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
  font-size: ${theme.fontSize.sm};
`;

const statusStyles = css`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.gray[500]};
`;

const actionsStyles = css`
  display: flex;
  gap: ${theme.spacing[1]};

  button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.borderRadius.md};
    background-color: transparent;
    color: ${theme.colors.gray[500]};
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: ${theme.transitions.fast};

    &:hover {
      background-color: ${theme.colors.gray[50]};
      color: ${theme.colors.gray[900]};
    }
  }
`;

interface ChatHeaderProps {
  chat: IChat;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const primaryParticipant = chat.participants[0];
  const isOnline = primaryParticipant?.status === 'online';

  return (
    <header className={headerStyles}>
      <div className={chatInfoStyles}>
        <img
          src={primaryParticipant?.avatar || 'https://via.placeholder.com/40'}
          alt={primaryParticipant?.name}
          className={avatarStyles}
        />
        <div className={detailsStyles}>
          <h2 className={nameStyles}>{chat.name || primaryParticipant?.name}</h2>
          <p className={statusStyles}>
            {isOnline ? '● Online' : `● ${primaryParticipant?.status || 'Offline'}`}
          </p>
        </div>
      </div>

      <div className={actionsStyles}>
        <button title="Call">☎️</button>
        <button title="Video">📹</button>
        <button title="Info">ℹ️</button>
        <button title="More">➕</button>
      </div>
    </header>
  );
};
