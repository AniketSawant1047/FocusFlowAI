import { createSlice } from '@reduxjs/toolkit';

const getInitialHabits = () => {
  try {
    const saved = localStorage.getItem('habits');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse habits:', e);
  }

  // Pre-populate habits for a sleek visual demo
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const dayBeforeYesterday = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

  return [
    {
      id: 'habit-1',
      name: 'Drink 3L Water',
      createdAt: dayBeforeYesterday,
      history: [dayBeforeYesterday, yesterday], // checked yesterday
      streak: 2,
      lastCompletedDate: yesterday,
    },
    {
      id: 'habit-2',
      name: 'Read Technical Books',
      createdAt: dayBeforeYesterday,
      history: [yesterday],
      streak: 1,
      lastCompletedDate: yesterday,
    },
    {
      id: 'habit-3',
      name: '10 min Mindfulness Meditation',
      createdAt: dayBeforeYesterday,
      history: [dayBeforeYesterday, yesterday],
      streak: 2,
      lastCompletedDate: yesterday,
    }
  ];
};

const persistHabits = (habits) => {
  try {
    localStorage.setItem('habits', JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits:', e);
  }
};

// Helper function to calculate current streak
const calculateStreak = (history) => {
  if (!history || history.length === 0) return 0;
  
  // Sort history descending (most recent first)
  const sortedDates = [...history].sort((a, b) => new Date(b) - new Date(a));
  
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // If the last completion was not today or yesterday, the streak is broken
  const latestDateStr = sortedDates[0];
  if (latestDateStr !== todayStr && latestDateStr !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let currentDateToCheck = new Date(latestDateStr);

  for (let i = 0; i < sortedDates.length; i++) {
    const dateStr = sortedDates[i];
    const date = new Date(dateStr);
    
    // Check if date corresponds to expected sequence
    if (i === 0) {
      streak = 1;
    } else {
      // Calculate difference in days
      const diffTime = Math.abs(currentDateToCheck - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDateToCheck = date; // update pointer
      } else if (diffDays === 0) {
        // duplicate date, skip
        continue;
      } else {
        // Gap exists, streak broken
        break;
      }
    }
  }
  
  return streak;
};

const habitSlice = createSlice({
  name: 'habits',
  initialState: {
    habits: getInitialHabits(),
  },
  reducers: {
    addHabit: (state, action) => {
      const newHabit = {
        id: `habit-${Date.now()}`,
        name: action.payload,
        createdAt: new Date().toISOString().split('T')[0],
        history: [],
        streak: 0,
        lastCompletedDate: null,
      };
      state.habits.push(newHabit);
      persistHabits(state.habits);
    },
    deleteHabit: (state, action) => {
      state.habits = state.habits.filter(h => h.id !== action.payload);
      persistHabits(state.habits);
    },
    toggleHabitCompletion: (state, action) => {
      const { habitId, date } = action.payload; // date is YYYY-MM-DD
      const habit = state.habits.find(h => h.id === habitId);
      if (habit) {
        const dateIndex = habit.history.indexOf(date);
        if (dateIndex > -1) {
          // Uncheck habit completion
          habit.history.splice(dateIndex, 1);
        } else {
          // Check habit completion
          habit.history.push(date);
        }
        
        // Recalculate streak and last completed date
        habit.streak = calculateStreak(habit.history);
        const sortedHistory = [...habit.history].sort((a, b) => new Date(b) - new Date(a));
        habit.lastCompletedDate = sortedHistory.length > 0 ? sortedHistory[0] : null;
        
        persistHabits(state.habits);
      }
    },
    importHabits: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.habits = action.payload;
        persistHabits(state.habits);
      }
    },
    clearAllHabits: (state) => {
      state.habits = [];
      persistHabits([]);
    }
  }
});

export const {
  addHabit,
  deleteHabit,
  toggleHabitCompletion,
  importHabits,
  clearAllHabits,
} = habitSlice.actions;

export default habitSlice.reducer;
