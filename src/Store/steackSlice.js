// src/store/streakSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Start empty or with defaults? Let's start empty so user MUST pick.
  actions: [], 
};

const streakSlice = createSlice({
  name: 'streaks',
  initialState,
  reducers: {
    // ... existing reducers ...
    markStreakCompleted: (state, action) => {
      const targetId = action.payload;
      const item = state.actions.find((i) => i.id === targetId);
      if (item) item.completed = true;
    },

    // NEW: Set the entire list at once (from Setup Screen)
    setAllActions: (state, action) => {
      state.actions = action.payload;
    },
    
    // NEW: Add a single custom action
    addNewAction: (state, action) => {
      state.actions.push({ ...action.payload, completed: false });
    }
  },
});

export const { markStreakCompleted, setAllActions, addNewAction } = streakSlice.actions;
export default streakSlice.reducer;