import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChatMessage } from '@types/index';

interface MessagesState {
  byConversationId: Record<string, IChatMessage[]>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

const initialState: MessagesState = {
  byConversationId: {},
  loading: {},
  error: {},
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: IChatMessage[] }>
    ) => {
      state.byConversationId[action.payload.conversationId] = action.payload.messages;
    },
    addMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: IChatMessage }>
    ) => {
      if (!state.byConversationId[action.payload.conversationId]) {
        state.byConversationId[action.payload.conversationId] = [];
      }
      state.byConversationId[action.payload.conversationId].push(action.payload.message);
    },
    updateMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: IChatMessage }>
    ) => {
      const messages = state.byConversationId[action.payload.conversationId];
      if (messages) {
        const index = messages.findIndex((m) => m.id === action.payload.message.id);
        if (index !== -1) {
          messages[index] = action.payload.message;
        }
      }
    },
    setMessageLoading: (
      state,
      action: PayloadAction<{ conversationId: string; loading: boolean }>
    ) => {
      state.loading[action.payload.conversationId] = action.payload.loading;
    },
    setMessageError: (
      state,
      action: PayloadAction<{ conversationId: string; error: string | null }>
    ) => {
      state.error[action.payload.conversationId] = action.payload.error;
    },
  },
});

export const { setMessages, addMessage, updateMessage, setMessageLoading, setMessageError } =
  messagesSlice.actions;

export default messagesSlice.reducer;
