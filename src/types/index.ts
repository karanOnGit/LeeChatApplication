export interface IUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  statusMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: IUser;
  content: string;
  attachments?: IAttachment[];
  reactions?: IReaction[];
  replyTo?: IChatMessage;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  readBy: string[];
}

export interface IAttachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  size: number;
  mimeType: string;
}

export interface IReaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface IChat {
  id: string;
  participants: IUser[];
  lastMessage?: IChatMessage;
  lastMessageAt?: Date;
  isGroup: boolean;
  name?: string;
  avatar?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
}

export interface IAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
