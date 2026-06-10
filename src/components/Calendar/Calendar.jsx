import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  IoChevronBackOutline, 
  IoChevronForwardOutline, 
  IoAddOutline 
} from 'react-icons/io5';

/**
 * Custom interactive Monthly Calendar component.
 * @param {Function} onSelectTask - Callback when clicking a task to edit it.
 * @param {Function} onAddTaskOnDate - Callback when clicking a date cell to add a task.
 */
export default function Calendar({ onSelectTask, onAddTaskOnDate }) {
  const tasks = useSelector((state) => state.tasks.tasks);

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper calculation logic
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const startOffset = getFirstDayOfMonth(year, month);

  const cells = [];
  
  // Fill offset days from previous month
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const dateObj = new Date(year, month - 1, d);
    cells.push({
      dateStr: dateObj.toISOString().split('T')[0],
      dayNum: d,
      isCurrentMonth: false,
    });
  }

  // Fill current month days
  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, month, d + 1); // offset check
    const dateStr = new Date(year, month, d).toLocaleDateString('sv-SE'); // YYYY-MM-DD
    cells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Fill padding days for end of calendar grid (multiple of 7)
  const remainingCells = 42 - cells.length; // 6 rows grid
  for (let d = 1; d <= remainingCells; d++) {
    const dateObj = new Date(year, month + 1, d);
    cells.push({
      dateStr: dateObj.toISOString().split('T')[0],
      dayNum: d,
      isCurrentMonth: false,
    });
  }

  // Group tasks by date
  const getTasksForDate = (dateStr) => {
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-xl card-shadow overflow-hidden">
      {/* Calendar Header Controls */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {monthNames[month]} {year}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Manage and schedule tasks visually
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950 rounded-xl transition-colors"
          >
            <IoChevronBackOutline className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-950 rounded-xl transition-all font-semibold"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-950 rounded-xl transition-colors"
          >
            <IoChevronForwardOutline className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Days Label Row */}
      <div className="grid grid-cols-7 border-b border-slate-150 dark:border-slate-800 text-center font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 py-3 bg-slate-50/20 dark:bg-slate-950/10">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Date Grid Cell Blocks */}
      <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-slate-150 dark:divide-slate-800 border-collapse">
        {cells.map((cell, index) => {
          const dayTasks = getTasksForDate(cell.dateStr);
          const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

          return (
            <div
              key={`${cell.dateStr}-${index}`}
              className={`min-h-[100px] p-2 flex flex-col justify-between group transition-colors relative hover:bg-slate-50/50 dark:hover:bg-slate-950/20 ${
                cell.isCurrentMonth
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100'
                  : 'bg-slate-50/40 dark:bg-slate-950/10 text-slate-400 dark:text-slate-650'
              }`}
            >
              {/* Day Number Cell Header */}
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30'
                      : ''
                  }`}
                >
                  {cell.dayNum}
                </span>

                {/* Add Task Hover shortcut button */}
                <button
                  onClick={() => onAddTaskOnDate(cell.dateStr)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary-500 p-0.5 rounded transition-all"
                  title="Add task on this date"
                >
                  <IoAddOutline className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks bullet list inside date */}
              <div className="flex-1 space-y-1 overflow-y-auto max-h-[70px] pr-0.5">
                {dayTasks.map((t) => {
                  let priorityDot = 'bg-yellow-500';
                  if (t.priority === 'high') priorityDot = 'bg-red-500';
                  if (t.priority === 'low') priorityDot = 'bg-green-500';

                  return (
                    <div
                      key={t.id}
                      onClick={() => onSelectTask(t)}
                      className={`px-1.5 py-0.5 rounded text-[10px] truncate cursor-pointer transition-all flex items-center gap-1 border border-transparent hover:border-primary-500/40 ${
                        t.status === 'completed'
                          ? 'bg-slate-100 text-slate-400 line-through dark:bg-slate-800/45 dark:text-slate-550'
                          : 'bg-primary-50/50 text-slate-700 dark:bg-slate-950/45 dark:text-slate-300'
                      }`}
                      title={t.title}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot}`} />
                      <span className="truncate">{t.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
