import { createSlice } from '@reduxjs/toolkit';

const getInitialTasks = () => {
  try {
    const saved = localStorage.getItem('tasks');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse tasks:', e);
  }
  
  // Seed data for clean initial look
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  return [
    {
      id: 'task-1',
      title: 'Design FocusFlowAI Layout System',
      description: 'Establish folder structure, mock API hooks, routes and dark mode layout styles.',
      status: 'completed',
      priority: 'high',
      category: 'Work',
      dueDate: today,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      pomodoros: 3,
    },
    {
      id: 'task-2',
      title: 'Create Kanban Board Columns',
      description: 'Implement drag-and-drop actions for Todo, In-Progress, and Completed lanes using HTML5 API.',
      status: 'in-progress',
      priority: 'high',
      category: 'Work',
      dueDate: today,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      pomodoros: 1,
    },
    {
      id: 'task-3',
      title: 'Voice recognition research',
      description: 'Research browser web speech API limits and integration with task title keywords parsing.',
      status: 'todo',
      priority: 'medium',
      category: 'Study',
      dueDate: tomorrow,
      createdAt: new Date().toISOString(),
      pomodoros: 0,
    },
    {
      id: 'task-4',
      title: 'Cardio Core Training',
      description: '30-minute high intensity workout followed by visual stretches.',
      status: 'todo',
      priority: 'low',
      category: 'Fitness',
      dueDate: yesterday, // Overdue task to demonstrate alerts
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      pomodoros: 0,
    },
    {
      id: 'task-5',
      title: 'Grocery checklist',
      description: 'Pick up milk, avocados, green tea, and dynamic protein snacks from market.',
      status: 'todo',
      priority: 'low',
      category: 'Shopping',
      dueDate: today,
      createdAt: new Date().toISOString(),
      pomodoros: 0,
    }
  ];
};

const getInitialCategories = () => {
  try {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : ['Work', 'Study', 'Personal', 'Fitness', 'Finance', 'Shopping'];
  } catch {
    return ['Work', 'Study', 'Personal', 'Fitness', 'Finance', 'Shopping'];
  }
};

const persistTasks = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
};

const persistCategories = (cats) => {
  try {
    localStorage.setItem('categories', JSON.stringify(cats));
  } catch (e) {
    console.error('Failed to save categories:', e);
  }
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: getInitialTasks(),
    categories: getInitialCategories(),
    searchQuery: '',
    filter: 'all', // 'all' | 'completed' | 'pending' | 'high' | 'today' | 'overdue'
    undoBuffer: null, // Stores last deleted task
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      persistTasks(state.tasks);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
        persistTasks(state.tasks);
      }
    },
    deleteTask: (state, action) => {
      const deletedTask = state.tasks.find(t => t.id === action.payload);
      if (deletedTask) {
        state.undoBuffer = deletedTask;
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        persistTasks(state.tasks);
      }
    },
    undoDeleteTask: (state) => {
      if (state.undoBuffer) {
        state.tasks.push(state.undoBuffer);
        state.undoBuffer = null;
        persistTasks(state.tasks);
      }
    },
    clearUndoBuffer: (state) => {
      state.undoBuffer = null;
    },
    duplicateTask: (state, action) => {
      const target = state.tasks.find(t => t.id === action.payload);
      if (target) {
        const copy = {
          ...target,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: `${target.title} (Copy)`,
          createdAt: new Date().toISOString(),
        };
        state.tasks.push(copy);
        persistTasks(state.tasks);
      }
    },
    addCategory: (state, action) => {
      const cat = action.payload.trim();
      if (cat && !state.categories.includes(cat)) {
        state.categories.push(cat);
        persistCategories(state.categories);
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(c => c !== action.payload);
      persistCategories(state.categories);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    incrementTaskPomodoro: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.pomodoros = (task.pomodoros || 0) + 1;
        persistTasks(state.tasks);
      }
    },
    importTasks: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.tasks = action.payload;
        persistTasks(state.tasks);
      }
    },
    clearAllTasks: (state) => {
      state.tasks = [];
      persistTasks([]);
    }
  }
});

export const {
  addTask,
  updateTask,
  deleteTask,
  undoDeleteTask,
  clearUndoBuffer,
  duplicateTask,
  addCategory,
  deleteCategory,
  setSearchQuery,
  setFilter,
  incrementTaskPomodoro,
  importTasks,
  clearAllTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
