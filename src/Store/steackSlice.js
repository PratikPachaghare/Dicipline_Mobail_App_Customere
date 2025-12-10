import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gym: false,
  study: false,
  meditation: false,
  yoga:false
};

const streakSlice = createSlice({
  name: 'streaks',
  initialState,
  reducers: {
    markStreakCompleted: (state, action) => {
      // action.payload should be "gym", "study", etc.
      const type = action.payload; 
      if (state[type] !== undefined) {
        state[type] = true;
      }
    },
    resetStreaks: (state) => {
      state.gym = false;
      state.study = false;
      state.meditation = false;
    }
  },
});

export const { markStreakCompleted, resetStreaks } = streakSlice.actions;
export default streakSlice.reducer;