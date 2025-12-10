import { configureStore } from '@reduxjs/toolkit';
import streakReducer from './steackSlice';

export const store = configureStore({
  reducer: {
    streaks: streakReducer,
  },
});