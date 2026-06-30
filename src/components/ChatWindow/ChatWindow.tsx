'use client';

import React, { useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { useAppSelector } from '@hooks/useAppSelector';
import { useFetchMessages } from '@hooks/useFetchMessages';
import { useSendMessage } from '@hooks/useSendMessage';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

const windowStyles = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${theme.colors.white};

  @media (max-width: ${theme.breakpoints.md}) {
    position: relative;
  }
`;

const emptyStateStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${theme.colors.gray[500]};
  text-align: center;
  gap: ${theme.spacing[4]};

  p {
    font-size: ${theme.fontSize.lg};
  }
`;

export const ChatWindow: React.FC = () => {
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const [messageInput, setMessageInput] = useState('');

  const { messages, loading: messagesLoading } = useFetchMessages({
    conversationId: selectedChat?.id || '',
    skip: !selectedChat,
  });

  const { sendMessage } = useSendMessage();

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    try {
      setMessageInput('');
      await sendMessage({
        conversationId: selectedChat.id,
        content: messageInput,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageInput(messageInput);
    }
  };

  if (!selectedChat) {
    return (
      <div className={windowStyles}>
        <div className={emptyStateStyles}>
          <p>💬</p>
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className={windowStyles}>
      <ChatHeader chat={selectedChat} />
      <MessageList messages={messages} loading={messagesLoading} />
      <MessageInput
        value={messageInput}
        onChange={setMessageInput}
        onSend={handleSendMessage}
        disabled={messagesLoading}
      />
    </div>
  );
};
