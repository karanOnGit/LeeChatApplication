import { IChat, IChatMessage, IAPIResponse, IUser } from '@localTypes/index';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ChatAPI {
  private async request<T>(
    path: string,
    options: { method?: string; body?: BodyInit; json?: unknown; params?: Record<string, unknown> } = {}
  ): Promise<IAPIResponse<T>> {
    const query = new URLSearchParams();
    Object.entries(options.params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    });
    const queryString = query.toString();
    const url = `${BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;

    const headers: Record<string, string> = {};
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let body = options.body;
    if (options.json !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.json);
    }

    const response = await fetch(url, { method: options.method || 'GET', headers, body });

    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    const data = (await response.json().catch(() => null)) as IAPIResponse<T> | null;
    if (!response.ok || !data) {
      throw new Error(data?.error || `Request failed (${response.status})`);
    }
    return data;
  }

  async getChats(params: {
    filter?: 'messages' | 'requests';
    limit?: number;
    skip?: number;
  }): Promise<IAPIResponse<IChat[]>> {
    return this.request<IChat[]>('/chats', { params });
  }

  async getChat(conversationId: string): Promise<IAPIResponse<IChat>> {
    return this.request<IChat>(`/chats/${conversationId}`);
  }

  async getMessages(params: {
    conversationId: string;
    limit?: number;
    skip?: number;
  }): Promise<IAPIResponse<IChatMessage[]>> {
    return this.request<IChatMessage[]>(`/chats/${params.conversationId}/messages`, {
      params: { limit: params.limit, skip: params.skip },
    });
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

    return this.request<IChatMessage>(`/chats/${payload.conversationId}/messages`, {
      method: 'POST',
      body: formData,
    });
  }

  async editMessage(
    conversationId: string,
    messageId: string,
    content: string
  ): Promise<IAPIResponse<IChatMessage>> {
    return this.request<IChatMessage>(`/chats/${conversationId}/messages/${messageId}`, {
      method: 'PATCH',
      json: { content },
    });
  }

  async deleteMessage(
    conversationId: string,
    messageId: string
  ): Promise<IAPIResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(`/chats/${conversationId}/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async searchChats(query: string): Promise<IAPIResponse<IChat[]>> {
    return this.request<IChat[]>('/chats/search', { params: { q: query } });
  }

  async markAsRead(conversationId: string): Promise<IAPIResponse<{ success: boolean }>> {
    return this.request<{ success: boolean }>(`/chats/${conversationId}/mark-as-read`, {
      method: 'POST',
    });
  }

  async getUsers(): Promise<IAPIResponse<IUser[]>> {
    return this.request<IUser[]>('/users');
  }
}

export const chatAPI = new ChatAPI();
