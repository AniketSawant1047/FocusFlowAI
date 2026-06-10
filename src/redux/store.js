import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import themeReducer from './themeSlice';
import habitReducer from './habitSlice';
import userReducer from './userSlice';
import analyticsReducer from './analyticsSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    theme: themeReducer,
    habits: habitReducer,
    user: userReducer,
    analytics: analyticsReducer,
  },
  // Adding production middleware configurations
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disabling serializable checks for standard Date parameters in state buffers
    }),
});

export default store;
