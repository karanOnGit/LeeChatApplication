import React, { useEffect, useRef } from 'react';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { IChatMessage } from '@localTypes/index';
import { useAppSelector } from '@hooks/useAppSelector';
import { MessageBubble } from './MessageBubble';

const containerStyles = css`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  background-color: ${theme.colors.white};
`;

const loadingStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${theme.colors.gray[500]};
`;

const messageGroupStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

interface MessageListProps {
  messages: IChatMessage[];
  loading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return <div className={containerStyles + ' ' + loadingStyles}>Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className={containerStyles + ' ' + loadingStyles}>No messages yet</div>;
  }

  const groupedMessages = messages.reduce((groups, message) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup[0].senderId === message.senderId) {
      lastGroup.push(message);
    } else {
      groups.push([message]);
    }
    return groups;
  }, [] as IChatMessage[][]);

  return (
    <div className={containerStyles}>
      {groupedMessages.map((group, idx) => (
        <div key={idx} className={messageGroupStyles}>
          {group.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isSent={message.senderId === currentUserId}
              showAvatar={idx === 0}
            />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
