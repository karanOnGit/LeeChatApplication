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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
`;

const videoCardStyles = css`
  aspect-ratio: 9/16;
  background: linear-gradient(135deg, ${theme.colors.gray[200]}, ${theme.colors.gray[100]});
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: ${theme.transitions.base};

  &:hover {
    transform: scale(1.02);
  }

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
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

const sampleVideos = [
  { id: 1, emoji: '🎬' },
  { id: 2, emoji: '🎥' },
  { id: 3, emoji: '📹' },
  { id: 4, emoji: '🎞️' },
  { id: 5, emoji: '📺' },
  { id: 6, emoji: '🎭' },
];

export default function VideosPage() {
  return (
    <>
      <Head>
        <title>Videos - LeeChat</title>
        <meta name="description" content="Video content" />
      </Head>

      <BaseLayout>
        <Sidebar activeRoute="/videos" />

        <div className={containerStyles}>
          <div className={headerStyles}>
            <h1 className={titleStyles}>Videos</h1>
          </div>

          <div className={gridStyles}>
            {sampleVideos.map((video) => (
              <div key={video.id} className={videoCardStyles}>
                {video.emoji}
              </div>
            ))}
          </div>
        </div>

        <div className={contentStyles}>
          <p>📺</p>
          <p>Select a video to watch</p>
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
