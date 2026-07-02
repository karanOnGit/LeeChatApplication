import React, { useState, useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { css } from '@emotion/css';
import { theme } from '@styles/theme';
import { atoms } from '@styles/atoms';
import { BaseLayout } from '@components/Layout/BaseLayout';
import { Sidebar } from '@components/Sidebar/Sidebar';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { logout } from '@store/slices/authSlice';
import { clearAuthToken } from '@graphql/client';

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

const settingsSectionStyles = css`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const sectionTitleStyles = css`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  margin-bottom: ${theme.spacing[3]};
  color: ${theme.colors.gray[900]};
`;

const settingItemStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[3]} 0;
  border-bottom: 1px solid ${theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const settingLabelStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const labelNameStyles = css`
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
`;

const labelDescStyles = css`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.gray[500]};
`;

const toggleStyles = css`
  width: 48px;
  height: 28px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background-color: ${theme.colors.gray[300]};
  position: relative;
  transition: ${theme.transitions.fast};

  &.enabled {
    background-color: ${theme.colors.success[600]};
  }

  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${theme.colors.white};
    top: 2px;
    left: 2px;
    transition: ${theme.transitions.fast};
  }

  &.enabled::after {
    left: 22px;
  }
`;

const selectStyles = css`
  padding: ${theme.spacing[2]};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  background-color: ${theme.colors.white};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
  }
`;

const buttonStyles = css`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  font-weight: ${theme.fontWeight.semibold};
  transition: ${theme.transitions.fast};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray[900]};

  &:hover {
    background-color: ${theme.colors.gray[50]};
    border-color: ${theme.colors.gray[300]};
  }

  &.primary {
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    border-color: ${theme.colors.primary[600]};

    &:hover {
      background-color: ${theme.colors.primary[700]};
      border-color: ${theme.colors.primary[700]};
    }
  }

  &.danger {
    color: ${theme.colors.error[600]};
    border-color: ${theme.colors.error[200]};

    &:hover {
      background-color: ${theme.colors.error[50]};
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

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [privacy, setPrivacy] = useState('friends');
  const [theme_, setTheme] = useState('light');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync dark mode toggle with document style
  const handleDarkModeToggle = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.body.style.filter = 'invert(1) hue-rotate(180deg)';
      document.body.style.backgroundColor = '#111827';
    } else {
      document.body.style.filter = 'none';
      document.body.style.backgroundColor = '';
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    dispatch(logout());
    router.replace('/login');
  };

  const handleSaveChanges = () => {
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => {
      setSuccessMsg(null);
      router.push('/');
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Settings - LeeChat</title>
        <meta name="description" content="Application settings" />
      </Head>

      <BaseLayout>
        <Sidebar activeRoute="/settings" />

        <div className={containerStyles}>
          <div className={headerStyles}>
            <h1 className={titleStyles}>Settings</h1>
          </div>

          {successMsg && (
            <div style={{ padding: theme.spacing[4], backgroundColor: theme.colors.success[100], color: theme.colors.success[700], textAlign: 'center', fontWeight: theme.fontWeight.semibold }}>
              {successMsg}
            </div>
          )}

          {/* Notifications Section */}
          <div className={settingsSectionStyles}>
            <h2 className={sectionTitleStyles}>🔔 Notifications</h2>

            <div className={settingItemStyles}>
              <div className={settingLabelStyles}>
                <div className={labelNameStyles}>Push Notifications</div>
                <div className={labelDescStyles}>Receive push notifications on your device</div>
              </div>
              <button
                className={`${toggleStyles} ${notifications ? 'enabled' : ''}`}
                onClick={() => setNotifications(!notifications)}
              />
            </div>

            <div className={settingItemStyles}>
              <div className={settingLabelStyles}>
                <div className={labelNameStyles}>Message Alerts</div>
                <div className={labelDescStyles}>Get notified for new messages</div>
              </div>
              <button
                className={`${toggleStyles} enabled`}
              />
            </div>
          </div>

          {/* Appearance Section */}
          <div className={settingsSectionStyles}>
            <h2 className={sectionTitleStyles}>🎨 Appearance</h2>

            <div className={settingItemStyles}>
              <div className={settingLabelStyles}>
                <div className={labelNameStyles}>Dark Mode</div>
                <div className={labelDescStyles}>Use dark theme for the app</div>
              </div>
              <button
                className={`${toggleStyles} ${darkMode ? 'enabled' : ''}`}
                onClick={handleDarkModeToggle}
              />
            </div>

            <div className={settingItemStyles}>
              <div className={settingLabelStyles}>
                <div className={labelNameStyles}>Theme</div>
                <div className={labelDescStyles}>Choose your preferred theme</div>
              </div>
              <select
                className={selectStyles}
                value={theme_}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>

          {/* Privacy Section */}
          <div className={settingsSectionStyles}>
            <h2 className={sectionTitleStyles}>🔒 Privacy & Security</h2>

            <div className={settingItemStyles}>
              <div className={settingLabelStyles}>
                <div className={labelNameStyles}>Profile Visibility</div>
                <div className={labelDescStyles}>Who can see your profile</div>
              </div>
              <select
                className={selectStyles}
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Danger Zone */}
          <div className={settingsSectionStyles}>
            <h2 className={sectionTitleStyles}>⚠️ Danger Zone</h2>

            <div className={settingItemStyles}>
              <div className={settingLabelStyles}>
                <div className={labelNameStyles}>Logout</div>
                <div className={labelDescStyles}>Sign out from your account</div>
              </div>
              <button className={`${buttonStyles} danger`} onClick={handleLogout}>Logout</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={settingsSectionStyles}
            style={{ display: 'flex', gap: theme.spacing[2], justifyContent: 'flex-end' }}
          >
            <button className={buttonStyles} onClick={() => router.push('/')}>Cancel</button>
            <button className={`${buttonStyles} primary`} onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>

        <div className={contentPanelStyles}>
          <p>⚙️</p>
          <p>Configure application settings</p>
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
