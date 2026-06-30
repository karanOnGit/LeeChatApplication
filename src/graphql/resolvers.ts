import { dummyChats, dummyMessages, dummyUsers } from './dummyData';
import { IChat, IChatMessage } from '@types/index';

// Store for mutations (in-memory)
let chatsStore = JSON.parse(JSON.stringify(dummyChats));
let messagesStore = JSON.parse(JSON.stringify(dummyMessages));

export const resolvers = {
  Query: {
    chats: (_: any, args: { filter?: any; limit?: number; skip?: number }) => {
      const limit = args.limit || 50;
      const skip = args.skip || 0;

      let filtered = chatsStore;

      if (args.filter?.type === 'requests') {
        filtered = chatsStore.filter((chat: IChat) => chat.unreadCount > 0);
      }

      const total = filtered.length;
      const paginatedChats = filtered.slice(skip, skip + limit);

      return {
        data: paginatedChats,
        total,
        page: Math.floor(skip / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      };
    },

    chat: (_: any, args: { id: string }) => {
      return chatsStore.find((chat: IChat) => chat.id === args.id);
    },

    messages: (_: any, args: { conversationId: string; limit?: number; skip?: number }) => {
      const limit = args.limit || 50;
      const skip = args.skip || 0;

      const conversationMessages = messagesStore.filter(
        (msg: IChatMessage) => msg.conversationId === args.conversationId
      );

      const total = conversationMessages.length;
      const paginatedMessages = conversationMessages.slice(skip, skip + limit);

      return {
        data: paginatedMessages,
        total,
        page: Math.floor(skip / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      };
    },

    searchChats: (_: any, args: { query: string }) => {
      const query = args.query.toLowerCase();
      return chatsStore.filter((chat: IChat) =>
        (chat.name || '').toLowerCase().includes(query) ||
        chat.participants.some((p) => p.name.toLowerCase().includes(query))
      );
    },

    currentUser: () => {
      return dummyUsers.find((u) => u.id === 'current-user');
    },
  },

  Mutation: {
    sendMessage: (
      _: any,
      args: { input: { conversationId: string; content: string; replyTo?: string } }
    ) => {
      const { conversationId, content, replyTo } = args.input;
      const messageId = `msg-${Date.now()}`;

      const newMessage: IChatMessage = {
        id: messageId,
        conversationId,
        senderId: 'current-user',
        sender: dummyUsers.find((u) => u.id === 'current-user')!,
        content,
        isEdited: false,
        createdAt: new Date(),
        readBy: ['current-user'],
        replyTo: replyTo
          ? messagesStore.find((m: IChatMessage) => m.id === replyTo)
          : undefined,
      };

      messagesStore.push(newMessage);

      // Update chat's lastMessage
      const chatIndex = chatsStore.findIndex((c: IChat) => c.id === conversationId);
      if (chatIndex !== -1) {
        chatsStore[chatIndex].lastMessage = newMessage;
        chatsStore[chatIndex].lastMessageAt = new Date();
        chatsStore[chatIndex].unreadCount = 0;
      }

      return newMessage;
    },

    editMessage: (
      _: any,
      args: { conversationId: string; messageId: string; content: string }
    ) => {
      const message = messagesStore.find((m: IChatMessage) => m.id === args.messageId);
      if (message) {
        message.content = args.content;
        message.isEdited = true;
        message.editedAt = new Date();
      }
      return message;
    },

    deleteMessage: (_: any, args: { conversationId: string; messageId: string }) => {
      const index = messagesStore.findIndex((m: IChatMessage) => m.id === args.messageId);
      if (index !== -1) {
        messagesStore.splice(index, 1);
        return true;
      }
      return false;
    },

    markAsRead: (_: any, args: { conversationId: string }) => {
      const chatIndex = chatsStore.findIndex((c: IChat) => c.id === args.conversationId);
      if (chatIndex !== -1) {
        chatsStore[chatIndex].unreadCount = 0;
        return true;
      }
      return false;
    },

    createChat: (_: any, args: { participantIds: string[] }) => {
      const chatId = `chat-${Date.now()}`;
      const participants = dummyUsers.filter((u) => args.participantIds.includes(u.id));

      const newChat: IChat = {
        id: chatId,
        participants,
        isGroup: participants.length > 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
      };

      chatsStore.push(newChat);
      return newChat;
    },
  },
};
