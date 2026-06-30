import React from 'react';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { IChatMessage } from '@types/index';
import { formatDistanceToNow } from 'date-fns';

const bubbleStyles = (isSent: boolean) => css`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: flex-end;
  flex-direction: ${isSent ? 'row-reverse' : 'row'};
`;

const avatarStyles = css`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
  flex-shrink: 0;
`;

const messageContentStyles = (isSent: boolean) => css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
  max-width: 55%;
  align-items: ${isSent ? 'flex-end' : 'flex-start'};
`;

const messageBoxStyles = (isSent: boolean) => css`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.xl};
  word-wrap: break-word;
  word-break: break-word;
  background-color: ${isSent ? theme.colors.primary[600] : theme.colors.gray[100]};
  color: ${isSent ? theme.colors.white : theme.colors.gray[900]};
  font-size: ${theme.fontSize.sm};
  line-height: 1.4;
`;

const timestampStyles = css`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.gray[500]};
  padding: 0 ${theme.spacing[3]};
`;

const replyStyles = css`
  background-color: ${theme.colors.gray[50]};
  border-left: 3px solid ${theme.colors.primary[600]};
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSize.xs};
  margin-bottom: ${theme.spacing[1]};
`;

const replyAuthorStyles = css`
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.primary[600]};
`;

interface MessageBubbleProps {
  message: IChatMessage;
  isSent?: boolean;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isSent = false,
  showAvatar = true,
}) => {
  const timestamp = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

  return (
    <div className={bubbleStyles(isSent)}>
      {showAvatar ? (
        <img
          src={message.sender.avatar}
          alt={message.sender.name}
          className={avatarStyles}
        />
      ) : (
        <div style={{ width: 32, height: 32 }} />
      )}

      <div className={messageContentStyles(isSent)}>
        {message.replyTo && (
          <div className={replyStyles}>
            <div className={replyAuthorStyles}>{message.replyTo.sender.name}</div>
            <div>{message.replyTo.content}</div>
          </div>
        )}
        <div className={messageBoxStyles(isSent)}>{message.content}</div>
        <span className={timestampStyles}>{timestamp}</span>
      </div>
    </div>
  );
};
