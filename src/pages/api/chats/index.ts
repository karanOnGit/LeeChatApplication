import type { NextApiRequest, NextApiResponse } from 'next';
import { IChat, IAPIResponse } from '@localTypes/index';

type ResponseData = IAPIResponse<IChat[]>;

const mockChats: IChat[] = [
  {
    id: '1',
    participants: [
      {
        id: 'u1',
        name: 'Pritul',
        username: 'pritul_1906',
        avatar: 'https://via.placeholder.com/56',
        status: 'online',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    lastMessageAt: new Date(Date.now() - 3600000),
    isGroup: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    unreadCount: 2,
    isPinned: false,
    isMuted: false,
    lastMessage: {
      id: 'msg1',
      conversationId: '1',
      senderId: 'u1',
      sender: {
        id: 'u1',
        name: 'Pritul',
        username: 'pritul_1906',
        avatar: 'https://via.placeholder.com/56',
        status: 'online',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      content: 'Hmm badhiya hai bass eek baar funding toh hone do',
      isEdited: false,
      createdAt: new Date(),
      readBy: [],
    },
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  const { filter = 'messages', limit = 50, skip = 0 } = req.query;

  try {
    const filteredChats = mockChats.slice(
      Number(skip),
      Number(skip) + Number(limit)
    );

    res.status(200).json({
      success: true,
      data: filteredChats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
