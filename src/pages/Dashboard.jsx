import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTask } from '../redux/taskSlice';
import AnalyticsChart from '../components/AnalyticsChart/AnalyticsChart';
import PomodoroTimer from '../components/PomodoroTimer/PomodoroTimer';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import { 
  IoCheckmarkCircleOutline, 
  IoAlertCircleOutline, 
  IoTimeOutline, 
  IoTrendingUpOutline,
  IoCalendarClearOutline,
  IoRibbonOutline
} from 'react-icons/io5';

export default function Dashboard({ onToast }) {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const user = useSelector((state) => state.user);
  const analytics = useSelector((state) => state.analytics);

  const [activeTimerTask, setActiveTimerTask] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate parameters
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'completed' || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date(todayStr);
  }).length;

  const todaysTasks = tasks.filter(t => t.dueDate === todayStr).length;

  // Filter tasks for today's quick summary
  const todaysList = tasks.filter(t => t.dueDate === todayStr);

  const handleTaskComplete = (task) => {
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

  const handleStartTimerFromTask = (task) => {
    setActiveTimerTask(task);
    if (onToast) onToast(`Focus timer set for: "${task.title}"`, 'info');
  };

  // Badges lists
  const unlockedBadges = user.achievements.filter(a => a.unlocked);

  const cardsData = [
    { label: 'Total Tasks', value: totalTasks, icon: <IoCalendarClearOutline className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Completed', value: completedTasks, icon: <IoCheckmarkCircleOutline className="w-6 h-6 text-green-500" />, bg: 'bg-green-50 dark:bg-green-950/20' },
    { label: 'Pending', value: pendingTasks, icon: <IoTimeOutline className="w-6 h-6 text-yellow-500" />, bg: 'bg-yellow-50 dark:bg-yellow-950/20' },
    { label: 'Overdue', value: overdueTasks, icon: <IoAlertCircleOutline className="w-6 h-6 text-red-500" />, bg: 'bg-red-50 dark:bg-red-950/20' }
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Welcome back, {user.name.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 dark:text-slate-400 text-sm font-medium mt-1">
          Here is your productivity snapshot for today. Let's make it count!
        </p>
      </div>

      {/* Grid: Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsData.map((card, i) => (
          <div key={i} className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center gap-4 card-shadow">
            <div className={`p-3 rounded-xl ${card.bg}`}>{card.icon}</div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {card.label}
              </p>
              <h3 className="text-xl font-bold text-slate-850 dark:text-slate-50 mt-0.5">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Timer, Score & Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Productivity Score & Weekly Velocity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Productivity Score Card */}
            <div className="md:col-span-1 p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Score
                  </span>
                  <IoTrendingUpOutline className="w-5 h-5 text-primary-500" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-850 dark:text-white mt-4">
                  {analytics.productivityScore}%
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
                  Calculated based on Pomodoros completed and daily focus duration tasks.
                </p>
              </div>

              <div className="mt-6">
                <ProgressBar 
                  value={analytics.productivityScore} 
                  colorClass="bg-gradient-to-r from-primary-550 to-primary-600" 
                />
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="md:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider">
                  Weekly Focus Velocity
                </h3>
                <span className="text-xs text-primary-500 font-bold bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded-md">
                  {analytics.focusMinutes} Minutes Total
                </span>
              </div>
              <AnalyticsChart type="weekly" data={analytics.dailyFocusHistory} />
            </div>

          </div>

          {/* Today's Tasks Checklist Summary */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-4">
              Today's Task List ({todaysList.length})
            </h3>
            
            {todaysList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs italic">
                No tasks scheduled for today. Drag or edit some to due today!
              </div>
            ) : (
              <div className="space-y-3">
                {todaysList.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-100 dark:border-slate-800/80 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-950/50 transition-all">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={t.status === 'completed'}
                        onChange={() => handleTaskComplete(t)}
                        className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-800 text-primary-600 focus:ring-primary-500"
                      />
                      <span className={`text-xs font-medium text-slate-700 dark:text-slate-200 ${
                        t.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}>
                        {t.title}
                      </span>
                    </div>

                    {t.status !== 'completed' && (
                      <button
                        onClick={() => handleStartTimerFromTask(t)}
                        className="text-[10px] text-primary-500 hover:underline font-bold"
                      >
                        Start Timer 🍅
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Pomodoro Timer & Achievements Badges */}
        <div className="space-y-6">
          {/* Pomodoro Timer widget */}
          <PomodoroTimer 
            activeTask={activeTimerTask} 
            onClearActiveTask={() => setActiveTimerTask(null)} 
            onToast={onToast} 
          />

          {/* Badges card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-white font-bold text-sm uppercase tracking-wider mb-4">
              <IoRibbonOutline className="w-5 h-5 text-yellow-500" />
              <span>Unlocked Badges ({unlockedBadges.length})</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {user.achievements.map((a) => (
                <div
                  key={a.id}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    a.unlocked
                      ? 'bg-yellow-50/50 border-yellow-200 text-slate-800 dark:bg-yellow-950/20 dark:border-yellow-900/30'
                      : 'bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800 opacity-35'
                  }`}
                  title={`${a.title}: ${a.description}`}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-[9px] font-bold mt-1 text-slate-500 dark:text-slate-400 truncate max-w-full">
                    {a.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
