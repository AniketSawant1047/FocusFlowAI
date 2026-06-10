import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Default to dark mode for rich visual aesthetics
    return 'dark';
  } catch {
    return 'dark';
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', state.mode);
        if (state.mode === 'dark') {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      } catch (e) {
        console.error(e);
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      try {
        localStorage.setItem('theme', action.payload);
        if (action.payload === 'dark') {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
