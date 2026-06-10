import { createSlice } from '@reduxjs/toolkit';

const getInitialAnalytics = () => {
  try {
    const saved = localStorage.getItem('analytics_stats');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse analytics:', e);
  }

  // Pre-seed focus minutes and pomodoros
  return {
    pomodorosCompleted: 12,
    focusMinutes: 300,
    productivityScore: 84, // out of 100
    dailyFocusHistory: [
      { date: 'Mon', minutes: 50 },
      { date: 'Tue', minutes: 75 },
      { date: 'Wed', minutes: 100 },
      { date: 'Thu', minutes: 25 },
      { date: 'Fri', minutes: 50 },
      { date: 'Sat', minutes: 0 },
      { date: 'Sun', minutes: 0 }
    ]
  };
};

const persistAnalytics = (stats) => {
  try {
    localStorage.setItem('analytics_stats', JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save analytics:', e);
  }
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: getInitialAnalytics(),
  reducers: {
    addFocusSession: (state, action) => {
      // action.payload: number of minutes
      state.focusMinutes += action.payload;
      state.pomodorosCompleted += 1;
      
      // Update history for today
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = weekdays[new Date().getDay()];
      
      const dayRecord = state.dailyFocusHistory.find(d => d.date === today);
      if (dayRecord) {
        dayRecord.minutes += action.payload;
      } else {
        state.dailyFocusHistory.push({ date: today, minutes: action.payload });
      }
      
      // Calculate a dynamic productivity score (caps at 100)
      state.productivityScore = Math.min(100, Math.round(50 + (state.pomodorosCompleted * 3) + (state.focusMinutes * 0.05)));
      
      persistAnalytics(state);
    },
    updateProductivityScore: (state, action) => {
      state.productivityScore = action.payload;
      persistAnalytics(state);
    },
    importAnalytics: (state, action) => {
      if (action.payload && typeof action.payload === 'object') {
        state.pomodorosCompleted = action.payload.pomodorosCompleted || 0;
        state.focusMinutes = action.payload.focusMinutes || 0;
        state.productivityScore = action.payload.productivityScore || 50;
        state.dailyFocusHistory = action.payload.dailyFocusHistory || [];
        persistAnalytics(state);
      }
    },
    resetAnalytics: (state) => {
      state.pomodorosCompleted = 0;
      state.focusMinutes = 0;
      state.productivityScore = 50;
      state.dailyFocusHistory = [
        { date: 'Mon', minutes: 0 },
        { date: 'Tue', minutes: 0 },
        { date: 'Wed', minutes: 0 },
        { date: 'Thu', minutes: 0 },
        { date: 'Fri', minutes: 0 },
        { date: 'Sat', minutes: 0 },
        { date: 'Sun', minutes: 0 }
      ];
      persistAnalytics(state);
    }
  }
});

export const { addFocusSession, updateProductivityScore, importAnalytics, resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
