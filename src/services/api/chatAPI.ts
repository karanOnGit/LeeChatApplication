import axios, { AxiosInstance } from 'axios';
import { IChat, IChatMessage, IAPIResponse, IPaginatedResponse } from '@types/index';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ChatAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async getChats(params: {
    filter?: 'messages' | 'requests';
    limit?: number;
    skip?: number;
  }): Promise<IAPIResponse<IChat[]>> {
    const response = await this.api.get<IAPIResponse<IChat[]>>('/chats', { params });
    return response.data;
  }

  async getChat(conversationId: string): Promise<IAPIResponse<IChat>> {
    const response = await this.api.get<IAPIResponse<IChat>>(`/chats/${conversationId}`);
    return response.data;
  }

  async getMessages(params: {
    conversationId: string;
    limit?: number;
    skip?: number;
  }): Promise<IAPIResponse<IChatMessage[]>> {
    const response = await this.api.get<IAPIResponse<IChatMessage[]>>(
      `/chats/${params.conversationId}/messages`,
      { params: { limit: params.limit, skip: params.skip } }
    );
    return response.data;
  }

  async sendMessage(payload: {
    conversationId: string;
    content: string;
    attachments?: File[];
    replyTo?: string;
  }): Promise<IAPIResponse<IChatMessage>> {
    const formData = new FormData();
    formData.append('content', payload.content);
    if (payload.replyTo) {
      formData.append('replyTo', payload.replyTo);
    }
    if (payload.attachments) {
      payload.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await this.api.post<IAPIResponse<IChatMessage>>(
      `/chats/${payload.conversationId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async editMessage(
    conversationId: string,
    messageId: string,
    content: string
  ): Promise<IAPIResponse<IChatMessage>> {
    const response = await this.api.patch<IAPIResponse<IChatMessage>>(
      `/chats/${conversationId}/messages/${messageId}`,
      { content }
    );
    return response.data;
  }

  async deleteMessage(
    conversationId: string,
    messageId: string
  ): Promise<IAPIResponse<{ success: boolean }>> {
    const response = await this.api.delete<IAPIResponse<{ success: boolean }>>(
      `/chats/${conversationId}/messages/${messageId}`
    );
    return response.data;
  }

  async searchChats(query: string): Promise<IAPIResponse<IChat[]>> {
    const response = await this.api.get<IAPIResponse<IChat[]>>('/chats/search', {
      params: { q: query },
    });
    return response.data;
  }

  async markAsRead(conversationId: string): Promise<IAPIResponse<{ success: boolean }>> {
    const response = await this.api.post<IAPIResponse<{ success: boolean }>>(
      `/chats/${conversationId}/mark-as-read`
    );
    return response.data;
  }
}

export const chatAPI = new ChatAPI();
