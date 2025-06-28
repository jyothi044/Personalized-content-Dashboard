import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
  settingsOpen: boolean;
  searchQuery: string;
  activeSection: 'feed' | 'trending' | 'favorites' | 'search';
}

const initialState: UiState = {
  darkMode: localStorage.getItem('darkMode') === 'true',
  sidebarOpen: window.innerWidth >= 1024,
  settingsOpen: false,
  searchQuery: '',
  activeSection: 'feed',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode.toString());
      document.documentElement.classList.toggle('dark', state.darkMode);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSettings: (state) => {
      state.settingsOpen = !state.settingsOpen;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveSection: (state, action: PayloadAction<'feed' | 'trending' | 'favorites' | 'search'>) => {
      state.activeSection = action.payload;
    },
    initializeTheme: (state) => {
      document.documentElement.classList.toggle('dark', state.darkMode);
    },
  },
});

export const { 
  toggleDarkMode, 
  toggleSidebar, 
  toggleSettings, 
  setSearchQuery, 
  setActiveSection,
  initializeTheme
} = uiSlice.actions;
export default uiSlice.reducer;