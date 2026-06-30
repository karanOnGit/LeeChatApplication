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
  overflow-y: auto;
`;

const headerStyles = css`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const titleStyles = css`
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
`;

const contentStyles = css`
  flex: 1;
  overflow-y: auto;
`;

const sectionStyles = css`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const coverStyles = css`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, ${theme.colors.primary[400]}, ${theme.colors.primary[600]});
  position: relative;
`;

const profileHeaderStyles = css`
  display: flex;
  align-items: flex-end;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  margin-top: -60px;
  position: relative;
  z-index: 1;
`;

const avatarStyles = css`
  width: 120px;
  height: 120px;
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
  border: 4px solid ${theme.colors.white};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const userInfoStyles = css`
  flex: 1;
`;

const nameStyles = css`
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[1]};
`;

const usernameStyles = css`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.gray[500]};
  margin-bottom: ${theme.spacing[2]};
`;

const statusBadgeStyles = css`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background-color: ${theme.colors.success[100]};
  color: ${theme.colors.success[700]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semibold};
`;

const bioStyles = css`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  color: ${theme.colors.gray[700]};
  line-height: 1.6;
`;

const statsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const statItemStyles = css`
  text-align: center;
`;

const statNumberStyles = css`
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary[600]};
  margin-bottom: ${theme.spacing[1]};
`;

const statLabelStyles = css`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const settingItemStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[3]};
  border-bottom: 1px solid ${theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const settingLabelStyles = css`
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
`;

const settingValueStyles = css`
  color: ${theme.colors.gray[500]};
  font-size: ${theme.fontSize.sm};
`;

const buttonStyles = css`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background-color: ${theme.colors.primary[600]};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  font-weight: ${theme.fontWeight.semibold};
  transition: ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.primary[700]};
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

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>Profile - LeeChat</title>
        <meta name="description" content="Your profile" />
      </Head>

      <BaseLayout>
        <Sidebar activeRoute="/profile" />

        <div className={containerStyles}>
          <div className={coverStyles} />

          <div className={profileHeaderStyles}>
            <img
              src="https://i.pravatar.cc/150?img=0"
              alt="Profile"
              className={avatarStyles}
            />
            <div className={userInfoStyles}>
              <h1 className={nameStyles}>You</h1>
              <p className={usernameStyles}>@reely_karan</p>
              <span className={statusBadgeStyles}>● Online</span>
            </div>
            <button className={buttonStyles}>Edit Profile</button>
          </div>

          <div className={bioStyles}>
            <p>🚀 Building amazing applications | 💻 Full-stack developer | 🎯 Always learning</p>
            <p style={{ marginTop: theme.spacing[2], fontSize: theme.fontSize.sm, color: theme.colors.gray[500] }}>
              📍 India | 🔗 leechat.dev
            </p>
          </div>

          <div className={statsGridStyles}>
            <div className={statItemStyles}>
              <div className={statNumberStyles}>245</div>
              <div className={statLabelStyles}>Posts</div>
            </div>
            <div className={statItemStyles}>
              <div className={statNumberStyles}>1.2K</div>
              <div className={statLabelStyles}>Followers</div>
            </div>
            <div className={statItemStyles}>
              <div className={statNumberStyles}>567</div>
              <div className={statLabelStyles}>Following</div>
            </div>
          </div>

          <div className={sectionStyles}>
            <h3 style={{ marginBottom: theme.spacing[3], fontWeight: theme.fontWeight.semibold }}>
              Account Settings
            </h3>
            <div className={settingItemStyles}>
              <span className={settingLabelStyles}>Email</span>
              <span className={settingValueStyles}>reely_karan@example.com</span>
            </div>
            <div className={settingItemStyles}>
              <span className={settingLabelStyles}>Phone</span>
              <span className={settingValueStyles}>+91 98765 43210</span>
            </div>
            <div className={settingItemStyles}>
              <span className={settingLabelStyles}>Joined</span>
              <span className={settingValueStyles}>January 1, 2024</span>
            </div>
          </div>
        </div>

        <div className={contentPanelStyles}>
          <p>👤</p>
          <p>View profile details</p>
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
