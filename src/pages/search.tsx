import React, { useState, useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { BaseLayout } from '@components/Layout/BaseLayout';
import { Sidebar } from '@components/Sidebar/Sidebar';
import { useFetchChats, useAppDispatch, useAuth } from '@hooks/index';
import { ChatListItem } from '@components/ChatList/ChatListItem';
import { setSelectedChat } from '@store/slices/chatSlice';
import { chatAPI } from '@services/api/chatAPI';
import { chatGraphQLService } from '@services/graphql/chatService';
import { IUser, IChat } from '@localTypes/index';

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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);
  const { conversations } = useFetchChats({ skip: true });

  useEffect(() => {
    if (currentUser) {
      chatAPI.getUsers()
        .then((res) => {
          if (res.success && res.data) {
            setUsers(res.data);
          }
        })
        .catch((err) => console.error('Failed to fetch users', err));
    }
  }, [currentUser]);

  const filteredConversations = conversations.filter((chat) =>
    (chat.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = users.filter((u) => {
    if (u.id === currentUser?.id) return false;
    const nameMatch = u.name.toLowerCase().includes(searchQuery.toLowerCase());
    const usernameMatch = u.username.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || usernameMatch;
  });

  const handleSelectChat = (chat: IChat) => {
    dispatch(setSelectedChat(chat));
    router.push('/');
  };

  const handleCreateChat = async (participantId: string) => {
    try {
      // Find if we already have an existing 1-on-1 conversation with this user
      const existingChat = conversations.find(
        (c) => !c.isGroup && c.participants.some((p) => p.id === participantId)
      );

      if (existingChat) {
        handleSelectChat(existingChat);
        return;
      }

      // Otherwise create a new chat
      const newChat = await chatGraphQLService.createChat([participantId]);
      dispatch(setSelectedChat(newChat));
      router.push('/');
    } catch (error) {
      console.error('Failed to create or open chat:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Search - LeeChat</title>
        <meta name="description" content="Search conversations and people" />
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
              <div>
                {/* Conversations Section */}
                {filteredConversations.length > 0 && (
                  <div style={{ marginBottom: theme.spacing[4] }}>
                    <h3 style={{ padding: `0 ${theme.spacing[4]}`, fontSize: theme.fontSize.xs, color: theme.colors.gray[500], textTransform: 'uppercase', marginBottom: theme.spacing[2], fontWeight: theme.fontWeight.bold }}>
                      Conversations
                    </h3>
                    {filteredConversations.map((chat) => (
                      <ChatListItem 
                        key={chat.id} 
                        chat={chat} 
                        onClick={() => handleSelectChat(chat)}
                      />
                    ))}
                  </div>
                )}

                {/* Users Section */}
                {filteredUsers.length > 0 && (
                  <div>
                    <h3 style={{ padding: `0 ${theme.spacing[4]}`, fontSize: theme.fontSize.xs, color: theme.colors.gray[500], textTransform: 'uppercase', marginBottom: theme.spacing[2], fontWeight: theme.fontWeight.bold }}>
                      People
                    </h3>
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => handleCreateChat(u.id)}
                        className={css`
                          display: flex;
                          align-items: center;
                          gap: ${theme.spacing[3]};
                          margin: 0 ${theme.spacing[2]} ${theme.spacing[2]} ${theme.spacing[2]};
                          padding: ${theme.spacing[3]};
                          border-radius: ${theme.borderRadius.lg};
                          cursor: pointer;
                          transition: ${theme.transitions.fast};

                          &:hover {
                            background-color: ${theme.colors.gray[50]};
                          }
                        `}
                      >
                        <img
                          src={u.avatar || 'https://i.pravatar.cc/150?img=5'}
                          alt={u.name}
                          className={css`
                            width: 52px;
                            height: 52px;
                            border-radius: ${theme.borderRadius.full};
                            object-fit: cover;
                          `}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontWeight: theme.fontWeight.semibold, fontSize: theme.fontSize.sm, color: theme.colors.gray[900] }}>
                            {u.name}
                          </h4>
                          <p style={{ fontSize: theme.fontSize.xs, color: theme.colors.gray[500] }}>
                            @{u.username} • {u.status || 'offline'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredConversations.length === 0 && filteredUsers.length === 0 && (
                  <div className={emptyStateStyles}>
                    <p>🔍</p>
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className={emptyStateStyles}>
                <p>🔍</p>
                <p>Start typing to search conversations & people</p>
              </div>
            )}
          </div>
        </div>

        <div className={contentStyles}>
          <p>📱</p>
          <p>Select a conversation or person to start messaging</p>
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
