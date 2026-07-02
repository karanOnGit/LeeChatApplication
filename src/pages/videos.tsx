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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
`;

const videoCardStyles = css`
  aspect-ratio: 9/16;
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[900]});
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  cursor: pointer;
  transition: ${theme.transitions.base};
  position: relative;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
`;

const playOverlayStyles = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing[3]};
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
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

const modalBackdropStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing[4]};
`;

const modalContentStyles = css`
  width: 100%;
  max-width: 450px;
  background-color: ${theme.colors.black};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const closeButtonStyles = css`
  position: absolute;
  top: ${theme.spacing[3]};
  right: ${theme.spacing[3]};
  background-color: rgba(0, 0, 0, 0.5);
  color: ${theme.colors.white};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const sampleVideos = [
  { id: 1, title: 'Cool Tech Reveal 📱', views: '24K', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', bg: 'linear-gradient(135deg, #6366f1, #312e81)' },
  { id: 2, title: 'Travel Vlog: Tokyo 🌸', views: '156K', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', bg: 'linear-gradient(135deg, #ec4899, #50072b)' },
  { id: 3, title: 'Epic Drone Shots 🏔️', views: '89K', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', bg: 'linear-gradient(135deg, #10b981, #064e3b)' },
  { id: 4, title: 'Relaxing Coding Music 🎧', views: '12K', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', bg: 'linear-gradient(135deg, #f59e0b, #78350f)' },
  { id: 5, title: 'Product Launch 🚀', views: '45K', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', bg: 'linear-gradient(135deg, #3b82f6, #1e3a8a)' },
  { id: 6, title: 'Funny Pet Compilation 🐶', views: '320K', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', bg: 'linear-gradient(135deg, #8b5cf6, #4c1d95)' },
];

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState<typeof sampleVideos[0] | null>(null);

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
              <div
                key={video.id}
                className={videoCardStyles}
                style={{ background: video.bg }}
                onClick={() => setActiveVideo(video)}
              >
                <span style={{ fontSize: 52 }}>▶️</span>
                <div className={playOverlayStyles}>
                  <span style={{ fontWeight: theme.fontWeight.semibold, fontSize: theme.fontSize.sm }}>
                    {video.title}
                  </span>
                  <span style={{ fontSize: theme.fontSize.xs, color: theme.colors.gray[300] }}>
                    {video.views} views
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={contentStyles}>
          {activeVideo ? (
            <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
              <h2 style={{ color: theme.colors.gray[900], fontWeight: theme.fontWeight.bold }}>
                {activeVideo.title}
              </h2>
              <video
                src={activeVideo.url}
                controls
                autoPlay
                style={{ width: '100%', borderRadius: theme.borderRadius.xl, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
            </div>
          ) : (
            <>
              <p>📺</p>
              <p>Select a video to watch</p>
            </>
          )}
        </div>
      </BaseLayout>

      {/* Video Modal Overlay for Mobile or Detailed View */}
      {activeVideo && (
        <div className={modalBackdropStyles} onClick={() => setActiveVideo(null)}>
          <div className={modalContentStyles} onClick={(e) => e.stopPropagation()}>
            <button className={closeButtonStyles} onClick={() => setActiveVideo(null)}>✕</button>
            <video
              src={activeVideo.url}
              controls
              autoPlay
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
            <div style={{ padding: theme.spacing[4], backgroundColor: theme.colors.gray[900], color: theme.colors.white }}>
              <h3 style={{ fontWeight: theme.fontWeight.bold, fontSize: theme.fontSize.base, marginBottom: theme.spacing[1] }}>
                {activeVideo.title}
              </h3>
              <p style={{ fontSize: theme.fontSize.xs, color: theme.colors.gray[400] }}>
                {activeVideo.views} views • Trending Reel
              </p>
            </div>
          </div>
        </div>
      )}
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
