import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';
import { 
  IoGridOutline, 
  IoListOutline, 
  IoLayersOutline, 
  IoCalendarOutline, 
  IoBarChartOutline, 
  IoSettingsOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoFlameOutline
} from 'react-icons/io5';

export default function Sidebar() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const user = useSelector((state) => state.user);

  const activeBadgesCount = user.achievements.filter(a => a.unlocked).length;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <IoGridOutline className="w-5 h-5" /> },
    { path: '/tasks', label: 'Task List', icon: <IoListOutline className="w-5 h-5" /> },
    { path: '/kanban', label: 'Kanban Board', icon: <IoLayersOutline className="w-5 h-5" /> },
    { path: '/calendar', label: 'Calendar', icon: <IoCalendarOutline className="w-5 h-5" /> },
    { path: '/analytics', label: 'Analytics', icon: <IoBarChartOutline className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <IoSettingsOutline className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen sticky top-0 no-print hidden md:flex z-40">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary-500/20">
          F
        </div>
        <div>
          <h1 className="font-bold text-slate-800 dark:text-white text-md leading-none">
            FocusFlow<span className="text-primary-500 font-extrabold">AI</span>
          </h1>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
            Productivity Suite
          </span>
        </div>
      </div>

      {/* User Profile Info */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-xl object-cover border-2 border-primary-500/10"
        />
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
            {user.name}
          </h4>
          <p className="text-xs text-slate-400 truncate">{user.role}</p>
          
          {/* Badge Count Indicators */}
          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-950/35 px-2 py-0.5 rounded-md w-fit">
            <IoFlameOutline className="w-3.5 h-3.5" />
            <span>{activeBadgesCount} BADGES</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-950/45 text-primary-600 dark:text-primary-400 font-bold border-l-4 border-primary-600 dark:border-primary-400 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950/50'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Theme Switcher */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
        <span className="text-xs text-slate-400 font-medium">Appearance</span>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 bg-white dark:bg-slate-900 transition-colors shadow-sm"
        >
          {themeMode === 'dark' ? <IoSunnyOutline className="w-4 h-4" /> : <IoMoonOutline className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
