import { graphqlClient } from '@graphql/client';
import {
  CHATS_QUERY,
  CHAT_QUERY,
  MESSAGES_QUERY,
  SEARCH_CHATS_QUERY,
  CURRENT_USER_QUERY,
} from '@graphql/queries';
import {
  SEND_MESSAGE_MUTATION,
  EDIT_MESSAGE_MUTATION,
  DELETE_MESSAGE_MUTATION,
  MARK_AS_READ_MUTATION,
  CREATE_CHAT_MUTATION,
} from '@graphql/mutations';
import { IChat, IChatMessage, IUser } from '@types/index';

interface ChatsResponse {
  chats: {
    data: IChat[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

interface MessagesResponse {
  messages: {
    data: IChatMessage[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

interface ChatResponse {
  chat: IChat;
}

interface SearchResponse {
  searchChats: IChat[];
}

interface UserResponse {
  currentUser: IUser;
}

interface SendMessageResponse {
  sendMessage: IChatMessage;
}

interface EditMessageResponse {
  editMessage: IChatMessage;
}

interface DeleteMessageResponse {
  deleteMessage: boolean;
}

interface MarkAsReadResponse {
  markAsRead: boolean;
}

interface CreateChatResponse {
  createChat: IChat;
}

export class ChatGraphQLService {
  async getChats(params: {
    filter?: 'messages' | 'requests';
    limit?: number;
    skip?: number;
  }): Promise<IChat[]> {
    try {
      const data = await graphqlClient.request<ChatsResponse>(CHATS_QUERY, {
        filter: params.filter,
        limit: params.limit || 50,
        skip: params.skip || 0,
      });
      return data.chats.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  async getChat(chatId: string): Promise<IChat> {
    try {
      const data = await graphqlClient.request<ChatResponse>(CHAT_QUERY, {
        id: chatId,
      });
      return data.chat;
    } catch (error) {
      console.error('Error fetching chat:', error);
      throw error;
    }
  }

  async getMessages(params: {
    conversationId: string;
    limit?: number;
    skip?: number;
  }): Promise<IChatMessage[]> {
    try {
      const data = await graphqlClient.request<MessagesResponse>(MESSAGES_QUERY, {
        conversationId: params.conversationId,
        limit: params.limit || 50,
        skip: params.skip || 0,
      });
      return data.messages.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(payload: {
    conversationId: string;
    content: string;
    replyTo?: string;
  }): Promise<IChatMessage> {
    try {
      const data = await graphqlClient.request<SendMessageResponse>(
        SEND_MESSAGE_MUTATION,
        {
          input: {
            conversationId: payload.conversationId,
            content: payload.content,
            replyTo: payload.replyTo,
          },
        }
      );
      return data.sendMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async editMessage(
    conversationId: string,
    messageId: string,
    content: string
  ): Promise<IChatMessage> {
    try {
      const data = await graphqlClient.request<EditMessageResponse>(
        EDIT_MESSAGE_MUTATION,
        {
          conversationId,
          messageId,
          content,
        }
      );
      return data.editMessage;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  async deleteMessage(conversationId: string, messageId: string): Promise<boolean> {
    try {
      const data = await graphqlClient.request<DeleteMessageResponse>(
        DELETE_MESSAGE_MUTATION,
        {
          conversationId,
          messageId,
        }
      );
      return data.deleteMessage;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  async searchChats(query: string): Promise<IChat[]> {
    try {
      const data = await graphqlClient.request<SearchResponse>(SEARCH_CHATS_QUERY, {
        query,
      });
      return data.searchChats;
    } catch (error) {
      console.error('Error searching chats:', error);
      throw error;
    }
  }

  async markAsRead(conversationId: string): Promise<boolean> {
    try {
      const data = await graphqlClient.request<MarkAsReadResponse>(
        MARK_AS_READ_MUTATION,
        {
          conversationId,
        }
      );
      return data.markAsRead;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<IUser> {
    try {
      const data = await graphqlClient.request<UserResponse>(CURRENT_USER_QUERY);
      return data.currentUser;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  async createChat(participantIds: string[]): Promise<IChat> {
    try {
      const data = await graphqlClient.request<CreateChatResponse>(CREATE_CHAT_MUTATION, {
        participantIds,
      });
      return data.createChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }
}

export const chatGraphQLService = new ChatGraphQLService();
