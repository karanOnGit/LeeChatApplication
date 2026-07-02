import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { BaseLayout } from '@components/Layout/BaseLayout';
import { Sidebar } from '@components/Sidebar/Sidebar';

const containerStyles = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.gray[200]};
`;

const headerStyles = css`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const titleStyles = css`
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
`;

const gridStyles = css`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
`;

const likeCardStyles = css`
  ${atoms.flexColumnCenter}
  padding: ${theme.spacing[4]};
  background: linear-gradient(135deg, ${theme.colors.error[50]}, ${theme.colors.primary[50]});
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: ${theme.transitions.base};
  border: 1px solid ${theme.colors.error[200]};

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, ${theme.colors.error[100]}, ${theme.colors.primary[100]});
  }

  &.active {
    background: linear-gradient(135deg, ${theme.colors.error[100]}, ${theme.colors.primary[100]});
    border-color: ${theme.colors.error[500]};
  }

  gap: ${theme.spacing[2]};
`;

const likeEmojiStyles = css`
  font-size: 32px;
`;

const likeTitleStyles = css`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  text-align: center;
  color: ${theme.colors.gray[900]};
`;

const contentPanelStyles = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.gray[50]};
  padding: ${theme.spacing[4]};
  overflow-y: auto;
`;

const itemCardStyles = css`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.gray[200]};
  margin-bottom: ${theme.spacing[3]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface LikedCategory {
  id: string;
  title: string;
  emoji: string;
}

interface LikedItem {
  id: string;
  categoryId: string;
  title: string;
  description: string;
}

const initialCategories: LikedCategory[] = [
  { id: 'posts', title: 'Posts', emoji: '📝' },
  { id: 'videos', title: 'Videos', emoji: '🎥' },
  { id: 'stories', title: 'Stories', emoji: '📖' },
  { id: 'reels', title: 'Reels', emoji: '🎬' },
];

const initialLikedItems: LikedItem[] = [
  { id: 'p1', categoryId: 'posts', title: 'Clean Architecture in Go', description: 'Liked on June 28, 2026' },
  { id: 'p2', categoryId: 'posts', title: 'Next.js 14 Speed Improvements', description: 'Liked on July 1, 2026' },
  { id: 'v1', categoryId: 'videos', title: 'Coding Live Stream', description: 'Liked on June 30, 2026' },
  { id: 's1', categoryId: 'stories', title: 'Startup Announcement', description: 'Liked on June 25, 2026' },
  { id: 'r1', categoryId: 'reels', title: 'Play Store Deployment Guide', description: 'Liked on July 2, 2026' },
];

export default function LikesPage() {
  const [categories, setCategories] = useState<LikedCategory[]>(initialCategories);
  const [likedItems, setLikedItems] = useState<LikedItem[]>(initialLikedItems);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('posts');

  const filteredItems = likedItems.filter(item => item.categoryId === selectedCategoryId);
  const getCount = (categoryId: string) => likedItems.filter(item => item.categoryId === categoryId).length;

  const handleUnlike = (itemId: string) => {
    setLikedItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <>
      <Head>
        <title>Likes - LeeChat</title>
        <meta name="description" content="Your liked content" />
      </Head>

      <BaseLayout>
        <Sidebar activeRoute="/likes" />

        <div className={containerStyles}>
          <div className={headerStyles}>
            <h1 className={titleStyles}>Your Likes</h1>
          </div>

          <div className={gridStyles}>
            {categories.map((item) => {
              const count = getCount(item.id);
              return (
                <div
                  key={item.id}
                  className={`${likeCardStyles} ${selectedCategoryId === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategoryId(item.id)}
                >
                  <div className={likeEmojiStyles}>{item.emoji}</div>
                  <div className={likeTitleStyles}>
                    {item.title}
                    <br />
                    <span style={{ fontSize: theme.fontSize.xs, color: theme.colors.gray[600] }}>
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={contentPanelStyles}>
          <h2 style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, marginBottom: theme.spacing[4], color: theme.colors.gray[900] }}>
            Liked {categories.find(c => c.id === selectedCategoryId)?.title}
          </h2>

          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className={itemCardStyles}>
                <div>
                  <h3 style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.gray[900] }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: theme.fontSize.xs, color: theme.colors.gray[500], marginTop: theme.spacing[1] }}>
                    {item.description}
                  </p>
                </div>
                <button
                  className={css`
                    padding: ${theme.spacing[1]} ${theme.spacing[3]};
                    background-color: ${theme.colors.error[50]};
                    color: ${theme.colors.error[600]};
                    border: 1px solid ${theme.colors.error[200]};
                    border-radius: ${theme.borderRadius.md};
                    cursor: pointer;
                    font-size: ${theme.fontSize.xs};
                    font-weight: ${theme.fontWeight.semibold};
                    transition: ${theme.transitions.fast};

                    &:hover {
                      background-color: ${theme.colors.error[100]};
                    }
                  `}
                  onClick={() => handleUnlike(item.id)}
                >
                  Unlike
                </button>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: theme.colors.gray[500], gap: theme.spacing[2] }}>
              <p style={{ fontSize: 48 }}>❤️</p>
              <p>No liked items found in this category.</p>
            </div>
          )}
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
