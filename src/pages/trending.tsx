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

  &.active {
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
  gap: ${theme.spacing[6]};
  color: ${theme.colors.gray[500]};
  font-size: ${theme.fontSize.sm};

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    font-size: inherit;
    display: flex;
    align-items: center;
    gap: ${theme.spacing[1]};
    padding: ${theme.spacing[1]} ${theme.spacing[2]};
    border-radius: ${theme.borderRadius.md};
    transition: ${theme.transitions.fast};

    &:hover {
      background-color: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[900]};
    }

    &.liked {
      color: ${theme.colors.error[500]};
    }
  }
`;

const contentPanelStyles = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.gray[50]};
  height: 100vh;
  overflow-y: auto;
`;

const commentSectionStyles = css`
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const commentStyles = css`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.gray[200]};
`;

const commentInputStyles = css`
  display: flex;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.white};
  border-top: 1px solid ${theme.colors.gray[200]};
  position: sticky;
  bottom: 0;

  input {
    flex: 1;
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    border: 1px solid ${theme.colors.gray[300]};
    border-radius: ${theme.borderRadius.md};
    outline: none;

    &:focus {
      border-color: ${theme.colors.primary[600]};
    }
  }

  button {
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    border: none;
    border-radius: ${theme.borderRadius.md};
    font-weight: ${theme.fontWeight.semibold};
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.primary[700]};
    }
  }
`;

interface Post {
  id: number;
  author: string;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  time: string;
  likedByUser?: boolean;
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: 'Pritul',
    username: 'pritul_1906',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Just launched a new feature! 🚀 Check it out and let me know what you think!',
    likes: 234,
    comments: 2,
    shares: 12,
    time: '2h ago',
  },
  {
    id: 2,
    author: 'Kshiteesh Dayal',
    username: 'kshiteesh_dayal',
    avatar: 'https://i.pravatar.cc/150?img=2',
    content: 'Web development tips: Always optimize your database queries. This can save you hours of debugging!',
    likes: 567,
    comments: 1,
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
    comments: 0,
    shares: 15,
    time: '6h ago',
  },
];

const initialCommentsMap: Record<number, { author: string; content: string; time: string }[]> = {
  1: [
    { author: 'Kshiteesh', content: 'Looks amazing, great work!', time: '1h ago' },
    { author: 'Abhishek', content: 'Super clean implementation.', time: '30m ago' },
  ],
  2: [
    { author: 'Pritul', content: 'Totally agree, database indexes are crucial.', time: '2h ago' },
  ],
  3: [],
};

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [commentsMap, setCommentsMap] = useState(initialCommentsMap);
  const [selectedPost, setSelectedPost] = useState<Post | null>(initialPosts[0]);
  const [newCommentText, setNewCommentText] = useState('');

  const handleLike = (postId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const liked = !post.likedByUser;
          const updated = {
            ...post,
            likedByUser: liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          };
          if (selectedPost?.id === postId) {
            setSelectedPost(updated);
          }
          return updated;
        }
        return post;
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedPost) return;

    const newComment = {
      author: 'You',
      content: newCommentText,
      time: 'Just now',
    };

    setCommentsMap((prevMap) => ({
      ...prevMap,
      [selectedPost.id]: [...(prevMap[selectedPost.id] || []), newComment],
    }));

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === selectedPost.id) {
          const updated = {
            ...post,
            comments: post.comments + 1,
          };
          setSelectedPost(updated);
          return updated;
        }
        return post;
      })
    );

    setNewCommentText('');
  };

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
            {posts.map((post) => (
              <div
                key={post.id}
                className={`${postStyles} ${selectedPost?.id === post.id ? 'active' : ''}`}
                onClick={() => setSelectedPost(post)}
              >
                <div className={postHeaderStyles}>
                  <img src={post.avatar} alt={post.author} className={avatarStyles} />
                  <div className={authorInfoStyles}>
                    <div className={authorNameStyles}>{post.author}</div>
                    <div className={timeStyles}>{post.time}</div>
                  </div>
                </div>
                <div className={contentStyles}>{post.content}</div>
                <div className={engagementStyles}>
                  <button
                    className={post.likedByUser ? 'liked' : ''}
                    onClick={(e) => handleLike(post.id, e)}
                  >
                    ❤️ {post.likes}
                  </button>
                  <span>💬 {post.comments}</span>
                  <button onClick={(e) => { e.stopPropagation(); alert('Shared post link copied to clipboard!'); }}>
                    🔄 {post.shares}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={contentPanelStyles}>
          {selectedPost ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Detailed Post View */}
              <div style={{ padding: theme.spacing[4], borderBottom: `1px solid ${theme.colors.gray[200]}`, backgroundColor: theme.colors.white }}>
                <div className={postHeaderStyles}>
                  <img src={selectedPost.avatar} alt={selectedPost.author} className={avatarStyles} />
                  <div className={authorInfoStyles}>
                    <div className={authorNameStyles}>{selectedPost.author}</div>
                    <div className={timeStyles}>@{selectedPost.username} • {selectedPost.time}</div>
                  </div>
                </div>
                <p style={{ fontSize: theme.fontSize.lg, lineHeight: 1.6, color: theme.colors.gray[900], marginBottom: theme.spacing[4] }}>
                  {selectedPost.content}
                </p>
                <div className={engagementStyles}>
                  <button
                    className={selectedPost.likedByUser ? 'liked' : ''}
                    onClick={(e) => handleLike(selectedPost.id, e)}
                  >
                    ❤️ {selectedPost.likes} Likes
                  </button>
                  <span>💬 {selectedPost.comments} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <div className={commentSectionStyles}>
                  <h3 style={{ fontSize: theme.fontSize.sm, color: theme.colors.gray[500], fontWeight: theme.fontWeight.bold, textTransform: 'uppercase' }}>
                    Discussion
                  </h3>
                  {(commentsMap[selectedPost.id] || []).length > 0 ? (
                    (commentsMap[selectedPost.id] || []).map((c, i) => (
                      <div key={i} className={commentStyles}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing[1] }}>
                          <span style={{ fontWeight: theme.fontWeight.semibold, fontSize: theme.fontSize.sm, color: theme.colors.gray[900] }}>
                            {c.author}
                          </span>
                          <span style={{ fontSize: theme.fontSize.xs, color: theme.colors.gray[500] }}>
                            {c.time}
                          </span>
                        </div>
                        <p style={{ fontSize: theme.fontSize.sm, color: theme.colors.gray[700] }}>
                          {c.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: theme.spacing[4], textAlign: 'center', color: theme.colors.gray[400] }}>
                      No comments yet. Start the conversation!
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Input */}
              <form className={commentInputStyles} onSubmit={handleAddComment}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                />
                <button type="submit">Post</button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: theme.colors.gray[500] }}>
              <p>🔥</p>
              <p>Select a post to view details & comments</p>
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
