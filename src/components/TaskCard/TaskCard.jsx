import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask, duplicateTask } from '../../redux/taskSlice';
import { 
  IoCheckboxOutline, 
  IoSquareOutline, 
  IoCalendarOutline, 
  IoCreateOutline, 
  IoTrashOutline, 
  IoDuplicateOutline,
  IoAlarmOutline,
  IoEllipsisVertical
} from 'react-icons/io5';

/**
 * Task item card with premium micro-interactions.
 * @param {object} task - Task details.
 * @param {Function} onEdit - Edit modal opener.
 * @param {Function} onAttachTimer - Attaches task to Pomodoro timer.
 * @param {Function} onToast - Toast notification trigger.
 */
export default function TaskCard({ task, onEdit, onAttachTimer, onToast }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const toggleComplete = () => {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    dispatch(updateTask({ id: task.id, status: nextStatus }));
    if (onToast) {
      if (nextStatus === 'completed') {
        onToast(`Completed: "${task.title}"! 🎉`, 'success');
      } else {
        onToast(`Marked pending: "${task.title}"`, 'info');
      }
    }
  };

  const handleDuplicate = () => {
    dispatch(duplicateTask(task.id));
    setShowMenu(false);
    if (onToast) onToast('Task duplicated!', 'success');
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    setShowMenu(false);
    if (onToast) onToast(`Deleted "${task.title}". Tap undo if accidental.`, 'warning', true);
  };

  // Dynamic color tags based on priority level
  const getPriorityClasses = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200/50 dark:border-red-900/40';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200/50 dark:border-green-900/40';
      case 'medium':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400 border-yellow-250/50 dark:border-yellow-900/40';
    }
  };

  // Due Date Checks
  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    if (task.dueDate === today) {
      return { text: 'Today', isOverdue: false, isToday: true };
    } else if (task.dueDate === tomorrow) {
      return { text: 'Tomorrow', isOverdue: false, isToday: false };
    }
    
    const isOverdue = new Date(task.dueDate) < new Date(today);
    return { text: task.dueDate, isOverdue, isToday: false };
  };

  const dueInfo = getDueDateLabel();

  return (
    <div className={`p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group card-shadow flex gap-3 relative ${
      task.status === 'completed' ? 'opacity-70' : ''
    }`}>
      {/* Checkbox Trigger */}
      <button 
        onClick={toggleComplete} 
        className="mt-0.5 text-slate-400 hover:text-primary-500 transition-colors self-start focus:outline-none"
      >
        {task.status === 'completed' ? (
          <IoCheckboxOutline className="w-5 h-5 text-primary-500" />
        ) : (
          <IoSquareOutline className="w-5 h-5" />
        )}
      </button>

      {/* Main Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          {/* Title */}
          <h4 className={`font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug break-words pr-4 ${
            task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''
          }`}>
            {task.title}
          </h4>

          {/* Actions Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              <IoEllipsisVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                {/* Backdrop closer */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xl z-20 py-1 text-xs text-slate-700 dark:text-slate-350">
                  <button
                    onClick={() => {
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2"
                  >
                    <IoCreateOutline className="w-4 h-4" /> Edit Task
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2"
                  >
                    <IoDuplicateOutline className="w-4 h-4" /> Duplicate
                  </button>
                  <button
                    onClick={() => {
                      if (onAttachTimer) onAttachTimer(task);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2"
                  >
                    <IoAlarmOutline className="w-4 h-4" /> Focus Session
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-900 text-red-500 flex items-center gap-2"
                  >
                    <IoTrashOutline className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 ${
            task.status === 'completed' ? 'line-through text-slate-450 dark:text-slate-500' : ''
          }`}>
            {task.description}
          </p>
        )}

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {/* Priority */}
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide border ${getPriorityClasses()}`}>
            {task.priority}
          </span>

          {/* Category */}
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/30 dark:border-slate-700/30">
            {task.category}
          </span>

          {/* Due date */}
          {dueInfo && (
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border flex items-center gap-1 ${
              dueInfo.isOverdue 
                ? 'bg-red-50 text-red-650 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/20' 
                : dueInfo.isToday
                ? 'bg-blue-50 text-blue-650 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/20'
                : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700/30'
            }`}>
              <IoCalendarOutline className="w-3.5 h-3.5" />
              {dueInfo.text}
            </span>
          )}

          {/* Pomodoros counter */}
          {(task.pomodoros > 0) && (
            <span 
              className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-primary-50 text-primary-650 border border-primary-100 dark:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900/30 flex items-center gap-0.5"
              title={`${task.pomodoros} focus sessions logged`}
            >
              🍅 <span className="font-bold">{task.pomodoros}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
