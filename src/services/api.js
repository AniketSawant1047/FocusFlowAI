import axios from 'axios';

// Base URL for the future production API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.focusflowai.local/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Tasks API Services (Pre-configured for future backend deployment)
 * Falls back gracefully to local client execution for standalone demo.
 */
export const tasksApi = {
  getTasks: async () => {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.warn('API connection failed. Operating in Offline/LocalStorage mode.', error.message);
      // Fallback: the calling Redux thunk will handle state offline,
      // but returning a rejected promise triggers the thunk fallback logic
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.warn('API connection failed. Saved task locally.', error.message);
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.warn(`API connection failed. Updated task ${id} locally.`, error.message);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`API connection failed. Deleted task ${id} locally.`, error.message);
      throw error;
    }
  },
};

export default apiClient;
