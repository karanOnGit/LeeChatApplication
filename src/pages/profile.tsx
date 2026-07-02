import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { BaseLayout } from '@components/Layout/BaseLayout';
import { Sidebar } from '@components/Sidebar/Sidebar';
import { useAuth, useAppDispatch } from '@hooks/index';
import { setUser, logout } from '@store/slices/authSlice';
import { clearAuthToken } from '@graphql/client';

const containerStyles = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.gray[200]};
  overflow-y: auto;
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
  text-transform: capitalize;
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

const sectionStyles = css`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
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

  &.secondary {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[900]};

    &:hover {
      background-color: ${theme.colors.gray[200]};
    }
  }

  &.danger {
    background-color: ${theme.colors.error[600]};
    color: ${theme.colors.white};

    &:hover {
      background-color: ${theme.colors.error[700]};
    }
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

const modalBackdropStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
`;

const modalContentStyles = css`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.xl};
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const inputStyles = css`
  width: 100%;
  padding: ${theme.spacing[3]};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary[600]};
  }
`;

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStatusMsg, setEditStatusMsg] = useState('');

  const handleOpenEdit = () => {
    if (user) {
      setEditName(user.name);
      setEditStatusMsg(user.statusMessage || '');
      setEditMode(true);
    }
  };

  const handleSaveProfile = () => {
    if (user) {
      dispatch(setUser({
        ...user,
        name: editName,
        statusMessage: editStatusMsg,
      }));
      setEditMode(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    dispatch(logout());
    router.replace('/login');
  };

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
              src={user?.avatar || "https://i.pravatar.cc/150?img=0"}
              alt="Profile"
              className={avatarStyles}
            />
            <div className={userInfoStyles}>
              <h1 className={nameStyles}>{user?.name || 'Loading...'}</h1>
              <p className={usernameStyles}>@{user?.username || 'loading'}</p>
              <span className={statusBadgeStyles}>● {user?.status || 'online'}</span>
            </div>
            <button className={buttonStyles} onClick={handleOpenEdit}>Edit Profile</button>
          </div>

          <div className={bioStyles}>
            <p>🚀 {user?.statusMessage || 'Building amazing applications | Full-stack developer | Always learning'}</p>
            <p style={{ marginTop: theme.spacing[2], fontSize: theme.fontSize.sm, color: theme.colors.gray[500] }}>
              📍 India | 🔗 leechat.dev
            </p>
          </div>

          <div className={statsGridStyles}>
            <div className={statItemStyles}>
              <div className={statNumberStyles}>12</div>
              <div className={statLabelStyles}>Conversations</div>
            </div>
            <div className={statItemStyles}>
              <div className={statNumberStyles}>145</div>
              <div className={statLabelStyles}>Followers</div>
            </div>
            <div className={statItemStyles}>
              <div className={statNumberStyles}>98</div>
              <div className={statLabelStyles}>Following</div>
            </div>
          </div>

          <div className={sectionStyles}>
            <h3 style={{ marginBottom: theme.spacing[3], fontWeight: theme.fontWeight.semibold }}>
              Account Settings
            </h3>
            <div className={settingItemStyles}>
              <span className={settingLabelStyles}>Email</span>
              <span className={settingValueStyles}>{user?.username || 'user'}@example.com</span>
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

          <div className={sectionStyles} style={{ display: 'flex', justifyContent: 'flex-end', padding: theme.spacing[4] }}>
            <button className={`${buttonStyles} danger`} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className={contentPanelStyles}>
          <p>👤</p>
          <p>View profile details</p>
        </div>
      </BaseLayout>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className={modalBackdropStyles}>
          <div className={modalContentStyles}>
            <h3 style={{ fontWeight: theme.fontWeight.bold, fontSize: theme.fontSize.lg, marginBottom: theme.spacing[2] }}>
              Edit Profile
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
              <label style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold, color: theme.colors.gray[600] }}>
                Name
              </label>
              <input
                className={inputStyles}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
              <label style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold, color: theme.colors.gray[600] }}>
                Status Message
              </label>
              <input
                className={inputStyles}
                value={editStatusMsg}
                onChange={(e) => setEditStatusMsg(e.target.value)}
                placeholder="Status Message"
              />
            </div>
            <div style={{ display: 'flex', gap: theme.spacing[2], justifyContent: 'flex-end', marginTop: theme.spacing[2] }}>
              <button className={`${buttonStyles} secondary`} onClick={() => setEditMode(false)}>
                Cancel
              </button>
              <button className={buttonStyles} onClick={handleSaveProfile}>
                Save
              </button>
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
