import type { NextApiRequest, NextApiResponse } from 'next';
import { IChatMessage, IAPIResponse } from '@localTypes/index';

type ResponseData = IAPIResponse<IChatMessage[]>;

const mockMessages: Record<string, IChatMessage[]> = {
  '1': [
    {
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
      content: 'Yaha toh eek ashish naam ke bande ko hire kar liya hai wo aab live krne reh gha hai',
      isEdited: false,
      createdAt: new Date(Date.now() - 300000),
      readBy: ['current-user'],
    },
    {
      id: 'msg2',
      conversationId: '1',
      senderId: 'current-user',
      sender: {
        id: 'current-user',
        name: 'You',
        username: 'reely_karan',
        avatar: 'https://via.placeholder.com/56',
        status: 'online',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      content: 'Loda inka kuch hona dekhte jao ek hi din bhaanda futenga',
      isEdited: false,
      createdAt: new Date(Date.now() - 240000),
      readBy: ['u1'],
    },
    {
      id: 'msg3',
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
      content: 'Eek backend developer chahiye shan ko le lete hai',
      isEdited: false,
      createdAt: new Date(Date.now() - 180000),
      readBy: ['current-user'],
    },
    {
      id: 'msg4',
      conversationId: '1',
      senderId: 'current-user',
      sender: {
        id: 'current-user',
        name: 'You',
        username: 'reely_karan',
        avatar: 'https://via.placeholder.com/56',
        status: 'online',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      content: 'Acha ye mujhe bass bata do play store me app to deploy kaise krte krna hain requirements kya hai',
      isEdited: false,
      createdAt: new Date(Date.now() - 120000),
      readBy: ['u1'],
    },
    {
      id: 'msg5',
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
      readBy: ['current-user'],
    },
  ],
};

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

  const { id } = req.query;
  const { limit = 50, skip = 0 } = req.query;

  try {
    const conversations = mockMessages[id as string] || [];
    const messages = conversations.slice(
      Number(skip),
      Number(skip) + Number(limit)
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
