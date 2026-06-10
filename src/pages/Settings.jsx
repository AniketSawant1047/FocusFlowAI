import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, resetAchievements, importUser } from '../redux/userSlice';
import { addHabit, deleteHabit, toggleHabitCompletion, importHabits, clearAllHabits } from '../redux/habitSlice';
import { clearAllTasks, importTasks } from '../redux/taskSlice';
import { resetAnalytics, importAnalytics } from '../redux/analyticsSlice';
import { exportToCSV, exportToPDF } from '../utils/export';
import { 
  IoSaveOutline, 
  IoCloudDownloadOutline, 
  IoCloudUploadOutline, 
  IoTrashOutline, 
  IoCheckmarkCircle, 
  IoCloseCircle, 
  IoAlertCircleOutline 
} from 'react-icons/io5';

export default function Settings({ onToast }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const habits = useSelector((state) => state.habits.habits);
  const tasks = useSelector((state) => state.tasks.tasks);
  const analytics = useSelector((state) => state.analytics);

  const fileInputRef = useRef(null);

  // Profile fields state
  const [profileName, setProfileName] = useState(user.name);
  const [profileRole, setProfileRole] = useState(user.role);
  const [profileAvatar, setProfileAvatar] = useState(user.avatar);

  // New habit text field state
  const [newHabitText, setNewHabitText] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      if (onToast) onToast('Profile name cannot be empty.', 'error');
      return;
    }
    dispatch(updateProfile({
      name: profileName.trim(),
      role: profileRole.trim(),
      avatar: profileAvatar.trim()
    }));
    if (onToast) onToast('User profile updated successfully!', 'success');
  };

  // Habits Operations
  const handleAddHabitSubmit = (e) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    dispatch(addHabit(newHabitText.trim()));
    setNewHabitText('');
    if (onToast) onToast('New habit added!', 'success');
  };

  const handleToggleHabit = (habitId) => {
    dispatch(toggleHabitCompletion({ habitId, date: todayStr }));
    if (onToast) onToast('Habit progress updated!', 'success');
  };

  const handleDeleteHabit = (habitId, name) => {
    dispatch(deleteHabit(habitId));
    if (onToast) onToast(`Deleted habit: "${name}"`, 'warning');
  };

  // Data Backups Export
  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '1.0.0',
        user: { name: user.name, role: user.role, avatar: user.avatar, achievements: user.achievements },
        tasks: tasks,
        habits: habits,
        analytics: analytics,
        exportedAt: new Date().toISOString()
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `FocusFlow_Backup_${todayStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      if (onToast) onToast('Backup file downloaded successfully!', 'success');
    } catch (err) {
      if (onToast) onToast(`Backup failed: ${err.message}`, 'error');
    }
  };

  // Data Backups Import
  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Validation check
        if (!data.tasks || !data.habits || !data.user) {
          throw new Error('Invalid JSON schema. Backup is missing vital nodes.');
        }

        dispatch(importTasks(data.tasks));
        dispatch(importHabits(data.habits));
        dispatch(importUser(data.user));
        
        if (data.analytics) {
          dispatch(importAnalytics(data.analytics));
        }

        if (onToast) onToast('State restored successfully!', 'success');
        
        // Clear input element
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        if (onToast) onToast(`Import failed: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
  };

  // Factory reset clear all
  const handleFactoryReset = () => {
    if (window.confirm('WARNING: Are you absolutely sure you want to clear all data? This cannot be undone.')) {
      dispatch(clearAllTasks());
      dispatch(clearAllHabits());
      dispatch(resetAnalytics());
      dispatch(resetAchievements());
      
      // Reset localStorage manually
      localStorage.clear();
      
      if (onToast) onToast('Application reset to factory defaults.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Application Settings
        </h1>
        <p className="text-slate-400 dark:text-slate-400 text-sm font-medium mt-1">
          Configure profile metrics, track daily habits check-ins, and manage database portabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Profile Setup & Reports */}
        <div className="space-y-6">
          
          {/* Profile Details Card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-4">
              User Profile Configuration
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Title / Role Description
                </label>
                <input
                  type="text"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={profileAvatar}
                  onChange={(e) => setProfileAvatar(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary-500/20"
              >
                <IoSaveOutline className="w-4.5 h-4.5" /> Save Profile
              </button>
            </form>
          </div>

          {/* Export Report Actions */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-4">
              Tasks Data Exporters
            </h3>
            
            <p className="text-xs text-slate-400 font-medium mb-4">
              Download your task checklists formatted for external spreadsheet software or printable document reports.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => exportToCSV(tasks)}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 text-xs font-bold transition-all"
              >
                Export CSV Sheet
              </button>
              <button
                onClick={() => exportToPDF(tasks)}
                className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 text-xs font-bold transition-all"
              >
                Export PDF Layout
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Habits tracker & Portabilities */}
        <div className="space-y-6">
          
          {/* Daily Habits Checklist Tracker */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-2">
              Habits Check-in Tracker
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Check in daily habits to lock in streaks!
            </p>

            {/* Checklist lists */}
            <div className="space-y-3 mb-6">
              {habits.length === 0 ? (
                <div className="py-6 text-center text-slate-450 text-xs italic">
                  No habits added yet. Track some below!
                </div>
              ) : (
                habits.map((h) => {
                  const isChecked = h.history.includes(todayStr);
                  return (
                    <div key={h.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/25 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleHabit(h.id)}
                          className="text-slate-400 hover:text-emerald-500 transition-colors focus:outline-none"
                        >
                          {isChecked ? (
                            <IoCheckmarkCircle className="w-5.5 h-5.5 text-emerald-500" />
                          ) : (
                            <div className="w-5.5 h-5.5 rounded-full border-2 border-slate-300 dark:border-slate-800" />
                          )}
                        </button>
                        <span className={`text-xs font-semibold text-slate-700 dark:text-slate-200 ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                          {h.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md">
                          🔥 {h.streak}d
                        </span>
                        <button
                          onClick={() => handleDeleteHabit(h.id, h.name)}
                          className="p-1 rounded text-red-500 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors"
                        >
                          <IoTrashOutline className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Habit inline Form */}
            <form onSubmit={handleAddHabitSubmit} className="flex gap-2">
              <input
                type="text"
                value={newHabitText}
                onChange={(e) => setNewHabitText(e.target.value)}
                placeholder="e.g. Read 20 pages"
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 text-xs text-slate-900 dark:text-slate-100"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs"
              >
                Track Habit
              </button>
            </form>
          </div>

          {/* Backup Database portability card */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl card-shadow">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider mb-2">
              Database Portability
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Export your overall database backups to file or upload existing backup structures to restore your session.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <IoCloudDownloadOutline className="w-4 h-4" /> Download JSON Backup
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-955 text-slate-700 dark:text-slate-350 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <IoCloudUploadOutline className="w-4 h-4" /> Upload Backup File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />

              <div className="border-t border-slate-100 dark:border-slate-800/80 my-3" />

              <button
                onClick={handleFactoryReset}
                className="w-full py-2.5 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-650 dark:text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <IoTrashOutline className="w-4 h-4" /> Factory Reset App
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
