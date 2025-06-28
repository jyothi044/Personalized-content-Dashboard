import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import contentSlice from './slices/contentSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    content: contentSlice,
    ui: uiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;