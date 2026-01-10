import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  actions: [],
  weekly: [],
  // ✅ FIX 1: Simplify keys to 'current' and 'longest'
  streak: {
    current: 0,  
    longest: 0,  
  },
};

const streakSlice = createSlice({
  name: 'streaks',
  initialState,
  reducers: {

    // =========================
    // 🔹 QUICK ACTIONS
    // =========================
    setAllActions: (state, action) => {
      state.actions = action.payload;
    },

    addNewAction: (state, action) => {
      state.actions.push({ ...action.payload, completed: false });
    },

    markStreakCompleted: (state, action) => {
      const item = state.actions.find(i => i.id === action.payload);
      if (item) item.completed = true;
    },

    // =========================
    // 🔹 WEEKLY STREAK
    // =========================
    setWeeklyStreak: (state, action) => {
      state.weekly = action.payload;
    },

    markWeeklyDone: (state, action) => {
      const day = state.weekly.find(d => d.day === action.payload);
      if (day) day.completed = true;
    },

    // =========================
    // 🔹 STREAKS (CURRENT + LONGEST)
    // =========================
    setStreaks: (state, action) => {
      const incoming = action.payload || {};

      // ✅FIX 2: Map API keys (backend) to State keys (frontend)
      // Backend bheje 'currentStreak', hum store karenge 'current' mein
      state.streak.current = incoming.currentStreak ?? 0;

      // Backend bheje 'longestStreak' ya 'LongestStreak', hum store karenge 'longest' mein
      state.streak.longest = incoming.longestStreak ?? incoming.LongestStreak ?? 0;
    },

    incrementCurrentStreak: (state) => {
      // ✅ FIX 3: Use 'current' consistent with initialState
      state.streak.current += 1;
      
      // ✅ FIX 4: Use 'longest' consistent with initialState
      if (state.streak.current > state.streak.longest) {
        state.streak.longest = state.streak.current;
      }
    },

    resetCurrentStreak: (state) => {
      // ✅ FIX 5: Use 'current' consistent with initialState
      state.streak.current = 0;
    },
  },
});

export const {
  setAllActions,
  addNewAction,
  markStreakCompleted,
  setWeeklyStreak,
  markWeeklyDone,
  setStreaks,
  incrementCurrentStreak,
  resetCurrentStreak,
} = streakSlice.actions;

export default streakSlice.reducer;