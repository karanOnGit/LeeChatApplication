import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  searchQuery: string;
  chatInfoPanelOpen: boolean;
  notificationsOpen: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  searchQuery: '',
  chatInfoPanelOpen: false,
  notificationsOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleChatInfoPanel: (state) => {
      state.chatInfoPanelOpen = !state.chatInfoPanelOpen;
    },
    setChatInfoPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.chatInfoPanelOpen = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsOpen = !state.notificationsOpen;
    },
    setNotificationsOpen: (state, action: PayloadAction<boolean>) => {
      state.notificationsOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setSearchQuery,
  toggleChatInfoPanel,
  setChatInfoPanelOpen,
  toggleNotifications,
  setNotificationsOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
