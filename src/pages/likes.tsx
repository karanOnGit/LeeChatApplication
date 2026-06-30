import React from 'react';
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
  background: linear-gradient(135deg, ${theme.colors.red[50]}, ${theme.colors.pink[50]});
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: ${theme.transitions.base};
  border: 1px solid ${theme.colors.red[100]};

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, ${theme.colors.red[100]}, ${theme.colors.pink[100]});
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

const contentPanelStyles = css`
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

const sampleLikes = [
  { id: 1, title: 'Posts', emoji: '📝', count: 42 },
  { id: 2, title: 'Videos', emoji: '🎥', count: 15 },
  { id: 3, title: 'Stories', emoji: '📖', count: 28 },
  { id: 4, title: 'Reels', emoji: '🎬', count: 67 },
  { id: 5, title: 'Comments', emoji: '💬', count: 34 },
  { id: 6, title: 'Shares', emoji: '🔄', count: 19 },
];

export default function LikesPage() {
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
            {sampleLikes.map((item) => (
              <div key={item.id} className={likeCardStyles}>
                <div className={likeEmojiStyles}>{item.emoji}</div>
                <div className={likeTitleStyles}>
                  {item.title}
                  <br />
                  <span style={{ fontSize: theme.fontSize.xs, color: theme.colors.gray[600] }}>
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={contentPanelStyles}>
          <p>❤️</p>
          <p>Select content to view details</p>
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
