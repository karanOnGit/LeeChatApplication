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

const feedStyles = css`
  flex: 1;
  overflow-y: auto;
`;

const postStyles = css`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[100]};
  cursor: pointer;
  transition: ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.gray[50]};
  }
`;

const postHeaderStyles = css`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[3]};
`;

const avatarStyles = css`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
`;

const authorInfoStyles = css`
  flex: 1;
`;

const authorNameStyles = css`
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
  font-size: ${theme.fontSize.sm};
`;

const timeStyles = css`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.gray[500]};
`;

const contentStyles = css`
  margin-bottom: ${theme.spacing[3]};
  color: ${theme.colors.gray[900]};
  line-height: 1.5;
`;

const engagementStyles = css`
  display: flex;
  gap: ${theme.spacing[4]};
  color: ${theme.colors.gray[500]};
  font-size: ${theme.fontSize.sm};
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

const trendingPosts = [
  {
    id: 1,
    author: 'Pritul',
    username: 'pritul_1906',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Just launched a new feature! 🚀 Check it out and let me know what you think!',
    likes: 234,
    comments: 45,
    shares: 12,
    time: '2h ago',
  },
  {
    id: 2,
    author: 'Kshiteesh',
    username: 'kshiteesh_dayal',
    avatar: 'https://i.pravatar.cc/150?img=2',
    content: 'Web development tips: Always optimize your database queries. This can save you hours of debugging!',
    likes: 567,
    comments: 89,
    shares: 34,
    time: '4h ago',
  },
  {
    id: 3,
    author: 'Abhishek',
    username: 'abhishek_0109',
    avatar: 'https://i.pravatar.cc/150?img=3',
    content: 'Working late nights building the next big thing 💪 #StartupLife',
    likes: 123,
    comments: 28,
    shares: 15,
    time: '6h ago',
  },
];

export default function TrendingPage() {
  return (
    <>
      <Head>
        <title>Trending - LeeChat</title>
        <meta name="description" content="Trending posts and content" />
      </Head>

      <BaseLayout>
        <Sidebar activeRoute="/trending" />

        <div className={containerStyles}>
          <div className={headerStyles}>
            <h1 className={titleStyles}>Trending</h1>
          </div>

          <div className={feedStyles}>
            {trendingPosts.map((post) => (
              <div key={post.id} className={postStyles}>
                <div className={postHeaderStyles}>
                  <img src={post.avatar} alt={post.author} className={avatarStyles} />
                  <div className={authorInfoStyles}>
                    <div className={authorNameStyles}>{post.author}</div>
                    <div className={timeStyles}>{post.time}</div>
                  </div>
                </div>
                <div className={contentStyles}>{post.content}</div>
                <div className={engagementStyles}>
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>🔄 {post.shares}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={contentPanelStyles}>
          <p>🔥</p>
          <p>Select a post to view details</p>
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
