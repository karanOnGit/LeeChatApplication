'use client';

import React, { useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { useAppSelector, useAppDispatch } from '@hooks/index';
import { useFetchChats } from '@hooks/useFetchChats';
import { setSelectedChat, setFilter } from '@store/slices/chatSlice';
import { ChatListItem } from './ChatListItem';

const panelStyles = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.gray[100]};
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    position: absolute;
    left: 60px;
    width: 360px;
    z-index: ${theme.zIndex.modal};
  }
`;

const headerStyles = css`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[100]};
`;

const userProfileStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[4]};
`;

const userNameStyles = css`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
`;

const actionButtonsStyles = css`
  display: flex;
  gap: ${theme.spacing[1]};

  button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.borderRadius.md};
    background-color: transparent;
    color: ${theme.colors.gray[500]};
    border: none;
    cursor: pointer;
    font-size: 15px;
    transition: ${theme.transitions.fast};

    &:hover {
      background-color: ${theme.colors.gray[50]};
      color: ${theme.colors.gray[900]};
    }
  }
`;

const searchBoxStyles = css`
  position: relative;

  input {
    width: 100%;
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    border: 1px solid ${theme.colors.gray[100]};
    border-radius: ${theme.borderRadius.lg};
    font-size: ${theme.fontSize.sm};
    background-color: ${theme.colors.white};
    transition: ${theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${theme.colors.gray[300]};
    }
  }
`;

const storyGridStyles = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[100]};
  overflow-x: auto;
`;

const storyItemStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};
  cursor: pointer;

  img {
    width: 60px;
    height: 60px;
    border-radius: ${theme.borderRadius.full};
    object-fit: cover;
  }

  p {
    font-size: ${theme.fontSize.xs};
    text-align: center;
    max-width: 60px;
  }
`;

const tabsStyles = css`
  display: flex;
  gap: ${theme.spacing[6]};
  padding: 0 ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[100]};

  button {
    padding: ${theme.spacing[3]} 0;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: ${theme.fontWeight.medium};
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.gray[500]};
    border-bottom: 2px solid transparent;
    transition: ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.gray[900]};
    }

    &.active {
      color: ${theme.colors.gray[900]};
      border-bottom-color: ${theme.colors.gray[900]};
    }
  }
`;

const chatListContainerStyles = css`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing[2]} 0;
`;

const emptyStateStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${theme.colors.gray[500]};
  text-align: center;
  padding: ${theme.spacing[4]};
`;

export const ChatListPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { conversations, filter, loading } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  useFetchChats({ filter });

  const filteredConversations = conversations.filter((chat) =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={panelStyles}>
      <div className={headerStyles}>
        <div className={userProfileStyles}>
          <h2 className={userNameStyles}>{user?.name || 'User'}</h2>
          <div className={actionButtonsStyles}>
            <button title="Compose">✎</button>
            <button title="Menu">⋮</button>
          </div>
        </div>
        <div className={searchBoxStyles}>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={storyGridStyles}>
        <div className={storyItemStyles}>
          <img src="https://via.placeholder.com/60" alt="Your note" />
          <p>Your note</p>
        </div>
        <div className={storyItemStyles}>
          <img src="https://via.placeholder.com/60" alt="Story" />
          <p>Story 1</p>
        </div>
        <div className={storyItemStyles}>
          <img src="https://via.placeholder.com/60" alt="Story" />
          <p>Story 2</p>
        </div>
        <div className={storyItemStyles}>
          <img src="https://via.placeholder.com/60" alt="Story" />
          <p>Story 3</p>
        </div>
      </div>

      <div className={tabsStyles}>
        <button
          className={filter === 'messages' ? 'active' : ''}
          onClick={() => dispatch(setFilter('messages'))}
        >
          Messages
        </button>
        <button
          className={filter === 'requests' ? 'active' : ''}
          onClick={() => dispatch(setFilter('requests'))}
        >
          Requests
        </button>
      </div>

      <div className={chatListContainerStyles}>
        {loading ? (
          <div className={emptyStateStyles}>Loading chats...</div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              onClick={() => dispatch(setSelectedChat(chat))}
            />
          ))
        ) : (
          <div className={emptyStateStyles}>No conversations found</div>
        )}
      </div>
    </div>
  );
};
