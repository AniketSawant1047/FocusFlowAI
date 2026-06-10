import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, addCategory } from '../../redux/taskSlice';
import { IoAdd, IoSave, IoSparkles } from 'react-icons/io5';

/**
 * Task Creation and Edit Form Component.
 * @param {object} taskToEdit - Object of the task if editing, otherwise null.
 * @param {Function} onClose - Close modal callback.
 * @param {Function} onToast - Toast message callback.
 */
export default function TaskForm({ taskToEdit = null, onClose, onToast }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.tasks.categories);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  // Hydrate fields if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority || 'medium');
      setCategory(taskToEdit.category || 'Personal');
      setDueDate(taskToEdit.dueDate || '');
    } else {
      // Default due date to today
      setDueDate(new Date().toISOString().split('T')[0]);
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      if (onToast) onToast('Please enter a task title!', 'error');
      return;
    }

    let finalCategory = category;

    // Handle adding custom category
    if (showCustomCategory && customCategoryName.trim()) {
      const formattedCat = customCategoryName.trim().charAt(0).toUpperCase() + customCategoryName.trim().slice(1);
      dispatch(addCategory(formattedCat));
      finalCategory = formattedCat;
    }

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category: finalCategory,
      dueDate,
      status: taskToEdit ? taskToEdit.status : 'todo',
      pomodoros: taskToEdit ? (taskToEdit.pomodoros || 0) : 0,
    };

    if (taskToEdit) {
      dispatch(updateTask({ id: taskToEdit.id, ...taskPayload }));
      if (onToast) onToast('Task updated successfully!', 'success');
    } else {
      dispatch(
        addTask({
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          createdAt: new Date().toISOString(),
          ...taskPayload,
        })
      );
      if (onToast) onToast('New task added successfully!', 'success');
    }

    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          Task Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Complete Redux Integration"
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all text-slate-900 dark:text-slate-100"
          required
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide additional details..."
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all text-slate-900 dark:text-slate-100 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Priority Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="low">Low (Green)</option>
            <option value="medium">Medium (Yellow)</option>
            <option value="high">High (Red)</option>
          </select>
        </div>

        {/* Due Date Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 text-sm text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Category Select */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          Category
        </label>
        <div className="flex gap-2">
          <select
            value={showCustomCategory ? 'custom' : category}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setShowCustomCategory(true);
              } else {
                setShowCustomCategory(false);
                setCategory(e.target.value);
              }
            }}
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 text-sm text-slate-900 dark:text-slate-100"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="custom">+ Create Custom Category</option>
          </select>
        </div>

        {/* Custom Category Input */}
        {showCustomCategory && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={customCategoryName}
              onChange={(e) => setCustomCategoryName(e.target.value)}
              placeholder="Custom Category name..."
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 text-sm text-slate-900 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={() => {
                setShowCustomCategory(false);
                setCustomCategoryName('');
              }}
              className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end gap-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950 text-sm transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-all flex items-center gap-1.5 shadow-md shadow-primary-500/20"
        >
          {taskToEdit ? (
            <>
              <IoSave className="w-4 h-4" /> Save Changes
            </>
          ) : (
            <>
              <IoAdd className="w-5 h-5" /> Add Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}
