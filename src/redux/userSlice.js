import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('user_profile');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse user profile:', e);
  }

  return {
    name: 'Alex Developer',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', // placeholder or beautiful avatar
    achievements: [
      { id: 'first_task', title: 'First Task', description: 'Completed your first task successfully.', unlocked: true, icon: '🎯', unlockedAt: new Date().toISOString() },
      { id: 'streak_7', title: '7 Day Streak', description: 'Complete daily habits for 7 days in a row.', unlocked: false, icon: '🔥', unlockedAt: null },
      { id: 'tasks_50', title: '50 Tasks Completed', description: 'Get through 50 full focus checklists.', unlocked: false, icon: '👑', unlockedAt: null },
      { id: 'productivity_master', title: 'Productivity Master', description: 'Complete 10 Pomodoro focus sessions.', unlocked: false, icon: '🧠', unlockedAt: null }
    ]
  };
};

const persistUser = (user) => {
  try {
    localStorage.setItem('user_profile', JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: getInitialUser(),
  reducers: {
    updateProfile: (state, action) => {
      const { name, role, avatar } = action.payload;
      if (name) state.name = name;
      if (role) state.role = role;
      if (avatar) state.avatar = avatar;
      persistUser(state);
    },
    unlockAchievement: (state, action) => {
      const achievement = state.achievements.find(a => a.id === action.payload);
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        persistUser(state);
      }
    },
    resetAchievements: (state) => {
      state.achievements = state.achievements.map(a => ({
        ...a,
        unlocked: a.id === 'first_task', // Keep first task unlocked as default seed check
        unlockedAt: a.id === 'first_task' ? new Date().toISOString() : null
      }));
      persistUser(state);
    },
    importUser: (state, action) => {
      if (action.payload && typeof action.payload === 'object') {
        state.name = action.payload.name || state.name;
        state.role = action.payload.role || state.role;
        state.avatar = action.payload.avatar || state.avatar;
        state.achievements = action.payload.achievements || state.achievements;
        persistUser(state);
      }
    }
  }
});

export const { updateProfile, unlockAchievement, resetAchievements, importUser } = userSlice.actions;
export default userSlice.reducer;
