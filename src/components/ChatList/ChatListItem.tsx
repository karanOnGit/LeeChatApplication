import React from 'react';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { IChat } from '@localTypes/index';
import { formatDistanceToNow } from 'date-fns';

const itemStyles = css`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin: 0 ${theme.spacing[2]};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.gray[50]};
  }

  &.active {
    background-color: ${theme.colors.gray[50]};
  }
`;

const avatarStyles = css`
  width: 52px;
  height: 52px;
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
  flex-shrink: 0;
`;

const contentStyles = css`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const headerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[2]};
`;

const nameStyles = css`
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
  font-size: ${theme.fontSize.sm};
`;

const timeStyles = css`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.gray[500]};
  white-space: nowrap;
`;

const messagePreviewStyles = css`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const unreadBadgeStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.primary[600]};
  color: ${theme.colors.white};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semibold};
`;

interface ChatListItemProps {
  chat: IChat;
  onClick?: () => void;
  isActive?: boolean;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onClick, isActive }) => {
  const lastMessageTime = chat.lastMessageAt
    ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false })
    : 'now';

  const primaryParticipant = chat.participants[0];

  return (
    <div className={`${itemStyles} ${isActive ? 'active' : ''}`} onClick={onClick}>
      <img
        src={primaryParticipant?.avatar || 'https://via.placeholder.com/56'}
        alt={primaryParticipant?.name}
        className={avatarStyles}
      />
      <div className={contentStyles}>
        <div className={headerStyles}>
          <h3 className={nameStyles}>{chat.name || primaryParticipant?.name}</h3>
          <span className={timeStyles}>{lastMessageTime}</span>
        </div>
        <p className={messagePreviewStyles}>{chat.lastMessage?.content || 'No messages'}</p>
      </div>
      {chat.unreadCount > 0 && <div className={unreadBadgeStyles}>{chat.unreadCount}</div>}
    </div>
  );
};
