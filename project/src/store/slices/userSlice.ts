import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  categories: string[];
  newsCountries: string[];
  movieGenres: string[];
  socialHashtags: string[];
}

interface UserState {
  preferences: UserPreferences;
  favorites: string[];
  contentOrder: string[];
}

const initialState: UserState = {
  preferences: {
    categories: ['technology', 'business', 'entertainment'],
    newsCountries: ['us'],
    movieGenres: ['Action', 'Comedy', 'Drama'], // Changed to string array for OMDb
    socialHashtags: ['tech', 'design', 'programming'],
  },
  favorites: [],
  contentOrder: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(action.payload));
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        localStorage.setItem('userFavorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
      localStorage.setItem('userFavorites', JSON.stringify(state.favorites));
    },
    updateContentOrder: (state, action: PayloadAction<string[]>) => {
      state.contentOrder = action.payload;
      localStorage.setItem('contentOrder', JSON.stringify(action.payload));
    },
    loadUserData: (state) => {
      const preferences = localStorage.getItem('userPreferences');
      if (preferences) {
        state.preferences = JSON.parse(preferences);
      }
      
      const favorites = localStorage.getItem('userFavorites');
      if (favorites) {
        state.favorites = JSON.parse(favorites);
      }
      
      const contentOrder = localStorage.getItem('contentOrder');
      if (contentOrder) {
        state.contentOrder = JSON.parse(contentOrder);
      }
    },
  },
});

export const { setPreferences, addFavorite, removeFavorite, updateContentOrder, loadUserData } = userSlice.actions;
export default userSlice.reducer;