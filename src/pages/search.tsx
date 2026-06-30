import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { BaseLayout } from '@components/Layout/BaseLayout';
import { Sidebar } from '@components/Sidebar/Sidebar';
import { useFetchChats } from '@hooks/useFetchChats';
import { ChatListItem } from '@components/ChatList/ChatListItem';

const searchPanelStyles = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.gray[200]};
  overflow: hidden;
`;

const searchHeaderStyles = css`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const searchTitleStyles = css`
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing[4]};
`;

const searchBoxStyles = css`
  input {
    width: 100%;
    padding: ${theme.spacing[3]};
    border: 1px solid ${theme.colors.gray[200]};
    border-radius: ${theme.borderRadius.lg};
    font-size: ${theme.fontSize.base};
    background-color: ${theme.colors.gray[50]};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary[500]};
      background-color: ${theme.colors.white};
    }
  }
`;

const resultsStyles = css`
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
  gap: ${theme.spacing[4]};

  p {
    font-size: ${theme.fontSize.lg};
  }
`;

const contentStyles = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.gray[50]};
  color: ${theme.colors.gray[500]};
  gap: ${theme.spacing[4]};

  p {
    font-size: ${theme.fontSize.lg};
  }
`;

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations } = useFetchChats({ skip: true });

  const filteredConversations = conversations.filter((chat) =>
    (chat.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Head>
        <title>Search - LeeChat</title>
        <meta name="description" content="Search conversations" />
      </Head>

      <BaseLayout>
        <Sidebar activeRoute="/search" />

        <div className={searchPanelStyles}>
          <div className={searchHeaderStyles}>
            <h1 className={searchTitleStyles}>Search</h1>
            <div className={searchBoxStyles}>
              <input
                type="text"
                placeholder="Search conversations, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className={resultsStyles}>
            {searchQuery.trim() ? (
              filteredConversations.length > 0 ? (
                filteredConversations.map((chat) => (
                  <ChatListItem key={chat.id} chat={chat} />
                ))
              ) : (
                <div className={emptyStateStyles}>
                  <p>🔍</p>
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )
            ) : (
              <div className={emptyStateStyles}>
                <p>🔍</p>
                <p>Start typing to search conversations</p>
              </div>
            )}
          </div>
        </div>

        <div className={contentStyles}>
          <p>📱</p>
          <p>Select a conversation to view details</p>
        </div>
      </BaseLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
  };
};
