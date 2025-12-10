import { configureStore } from '@reduxjs/toolkit';
import streakReducer from './steackSlice.js';

export const store = configureStore({
  reducer: {
    streaks: streakReducer,
  },
});