import React from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { BaseLayout } from '@components/Layout/BaseLayout';
import { Sidebar } from '@components/Sidebar/Sidebar';
import { ChatListPanel } from '@components/ChatList/ChatListPanel';
import { ChatWindow } from '@components/ChatWindow/ChatWindow';
import { IChat } from '@types/index';

interface HomePageProps {
  initialChats?: IChat[];
  buildTime: string;
}

export default function HomePage({ buildTime }: HomePageProps) {
  return (
    <>
      <Head>
        <title>LeeChat - Messages</title>
        <meta name="description" content="Real-time chat application" />
        <meta property="og:title" content="LeeChat" />
        <meta property="og:description" content="Real-time chat application" />
      </Head>

      <BaseLayout>
        <Sidebar activeRoute="/" />
        <ChatListPanel />
        <ChatWindow />
      </BaseLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  try {
    return {
      props: {
        buildTime: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      notFound: true,
    };
  }
};
