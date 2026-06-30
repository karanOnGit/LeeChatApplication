import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChat, IChatMessage } from '@types/index';

interface ChatState {
  conversations: IChat[];
  selectedChat: IChat | null;
  loading: boolean;
  error: string | null;
  filter: 'messages' | 'requests';
}

const initialState: ChatState = {
  conversations: [],
  selectedChat: null,
  loading: false,
  error: null,
  filter: 'messages',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<IChat[]>) => {
      state.conversations = action.payload;
    },
    setSelectedChat: (state, action: PayloadAction<IChat | null>) => {
      state.selectedChat = action.payload;
    },
    addConversation: (state, action: PayloadAction<IChat>) => {
      const exists = state.conversations.find((c) => c.id === action.payload.id);
      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },
    updateConversation: (state, action: PayloadAction<IChat>) => {
      const index = state.conversations.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.conversations[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<'messages' | 'requests'>) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setConversations,
  setSelectedChat,
  addConversation,
  updateConversation,
  setLoading,
  setError,
  setFilter,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
