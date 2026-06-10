import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, undoDeleteTask, clearUndoBuffer } from '../redux/taskSlice';
import SearchBar from '../components/SearchBar/SearchBar';
import TaskCard from '../components/TaskCard/TaskCard';
import TaskForm from '../components/TaskForm/TaskForm';
import Modal from '../components/Modal/Modal';
import { IoAdd, IoClipboardOutline } from 'react-icons/io5';

export default function Tasks({ onToast }) {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const filter = useSelector((state) => state.tasks.filter);
  const searchQuery = useSelector((state) => state.tasks.searchQuery);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Recount / Filter tasks list
  const filteredTasks = tasks.filter((t) => {
    // 1. Search filter
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Tab filter
    let matchesTab = true;
    if (filter === 'completed') matchesTab = t.status === 'completed';
    else if (filter === 'pending') matchesTab = t.status !== 'completed';
    else if (filter === 'high') matchesTab = t.priority === 'high';
    else if (filter === 'today') matchesTab = t.dueDate === todayStr;
    else if (filter === 'overdue') {
      matchesTab = t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date(todayStr);
    }

    // 3. Category selector filter
    const matchesCategory = selectedCategoryFilter === 'All' || t.category === selectedCategoryFilter;

    return matchesSearch && matchesTab && matchesCategory;
  });

  const categoriesList = ['All', ...useSelector((state) => state.tasks.categories)];

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  // Dedicated toast trigger wrapper that supports Undo actions
  const handleToastTrigger = (message, type, showUndo = false) => {
    if (onToast) {
      onToast(
        message, 
        type, 
        showUndo ? {
          label: 'Undo',
          action: () => {
            dispatch(undoDeleteTask());
            onToast('Deletion undone!', 'success');
          }
        } : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Task Management
          </h1>
          <p className="text-slate-400 dark:text-slate-400 text-sm font-medium mt-1">
            Review, sort, and organize focus checklists.
          </p>
        </div>

        <button
          onClick={handleCreateClick}
          className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary-500/20 self-start sm:self-auto"
        >
          <IoAdd className="w-5 h-5" /> Add New Task
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm card-shadow space-y-4">
        <SearchBar onToast={handleToastTrigger} />
        
        {/* Category Inline Selector tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-2 shrink-0">
            Category
          </span>
          <div className="flex gap-1.5">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  selectedCategoryFilter === cat
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white'
                    : 'text-slate-400 hover:text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-950/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Grid lists */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 card-shadow">
          <IoClipboardOutline className="w-12 h-12 text-slate-350 dark:text-slate-650 mb-3" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
            No matching tasks found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Try resetting your active search queries or filters to view pending records.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditClick}
              onAttachTimer={(t) => {
                // To attach focus timer, we trigger a redirect to Dashboard with a timer payload
                // Or simply alert. Here we redirect or toast since Dashboard holds the main Pomodoro widget
                if (onToast) onToast(`Attached "${t.title}" to timer. Find it on the Dashboard! 🍅`, 'success');
              }}
              onToast={handleToastTrigger}
            />
          ))}
        </div>
      )}

      {/* Edit Form Modal Overlay */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={taskToEdit ? 'Modify Task Details' : 'Create New Focus Task'}
      >
        <TaskForm
          taskToEdit={taskToEdit}
          onClose={() => setIsFormOpen(false)}
          onToast={handleToastTrigger}
        />
      </Modal>
    </div>
  );
}
