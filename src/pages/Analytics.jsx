import React from 'react';
import { useSelector } from 'react-redux';
import AnalyticsChart from '../components/AnalyticsChart/AnalyticsChart';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import { 
  IoFlame, 
  IoCheckmarkCircle, 
  IoHourglass, 
  IoPieChartOutline 
} from 'react-icons/io5';

export default function Analytics() {
  const tasks = useSelector((state) => state.tasks.tasks);
  const habits = useSelector((state) => state.habits.habits);
  const analytics = useSelector((state) => state.analytics);

  // 1. Task Status Data
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status !== 'completed').length;
  const statusData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount }
  ];

  // 2. Category Distribution Data
  const categoryCounts = {};
  tasks.forEach((t) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  // 3. Monthly Performance Line Chart (Simulated + Current Month dynamic)
  const monthlyData = [
    { month: 'Mar', completed: 18, sessions: 25 },
    { month: 'Apr', completed: 28, sessions: 40 },
    { month: 'May', completed: 35, sessions: 52 },
    { month: 'Jun', completed: completedCount + 10, sessions: analytics.pomodorosCompleted + 5 }
  ];

  // 4. Habit streak summary calculation
  const bestHabitStreak = habits.reduce((max, h) => (h.streak > max ? h.streak : max), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Productivity Analytics
        </h1>
        <p className="text-slate-400 dark:text-slate-400 text-sm font-medium mt-1">
          Deep dive into task completion velocities, categories, and focus clock logs.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center gap-4 card-shadow">
          <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-violet-500">
            <IoHourglass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Focus Duration</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{analytics.focusMinutes} Mins</h3>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center gap-4 card-shadow">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
            <IoCheckmarkCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Completed Tasks</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{completedCount} Tasks</h3>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center gap-4 card-shadow">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500">
            <IoFlame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Habit Max Streak</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{bestHabitStreak} Days</h3>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center gap-4 card-shadow">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500">
            <IoPieChartOutline className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Focus Score</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{analytics.productivityScore}/100</h3>
          </div>
        </div>
      </div>

      {/* Charts Layout Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Productivity Area */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-4">
            Weekly Focus Velocity
          </h3>
          <AnalyticsChart type="weekly" data={analytics.dailyFocusHistory} />
        </div>

        {/* Category distribution Pie */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-4">
            Category Focus Share
          </h3>
          {categoryData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-xs text-slate-400 italic">
              No categories mapped yet. Add tasks with categories to analyze.
            </div>
          ) : (
            <AnalyticsChart type="category" data={categoryData} />
          )}
        </div>

        {/* Task completion ratios Bar */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-4">
            Task Status Ratio
          </h3>
          <AnalyticsChart type="status" data={statusData} />
        </div>

        {/* Monthly completion velocity Line */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-4">
            Monthly Growth Performance
          </h3>
          <AnalyticsChart type="monthly" data={monthlyData} />
        </div>
      </div>

      {/* Habit trackers list */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-4 flex items-center gap-1">
          <IoFlame className="w-5 h-5 text-amber-500" />
          <span>Active Streak Tracker</span>
        </h3>

        {habits.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs italic">
            No habits active. Create habit streak logs in Settings page!
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((h) => {
              const cap = Math.min(100, Math.round((h.streak / 7) * 100)); // normalized to weekly target
              return (
                <div key={h.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{h.name}</span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      🔥 {h.streak} day streak
                    </span>
                  </div>
                  <ProgressBar value={cap} colorClass="bg-gradient-to-r from-amber-500 to-amber-600" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
