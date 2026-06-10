import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoMenuOutline, 
  IoCloseOutline,
  IoMoonOutline, 
  IoSunnyOutline,
  IoGridOutline, 
  IoListOutline, 
  IoLayersOutline, 
  IoCalendarOutline, 
  IoBarChartOutline, 
  IoSettingsOutline 
} from 'react-icons/io5';

export default function Navbar() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <IoGridOutline className="w-5 h-5" /> },
    { path: '/tasks', label: 'Tasks', icon: <IoListOutline className="w-5 h-5" /> },
    { path: '/kanban', label: 'Kanban', icon: <IoLayersOutline className="w-5 h-5" /> },
    { path: '/calendar', label: 'Calendar', icon: <IoCalendarOutline className="w-5 h-5" /> },
    { path: '/analytics', label: 'Analytics', icon: <IoBarChartOutline className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <IoSettingsOutline className="w-5 h-5" /> },
  ];

  return (
    <header className="md:hidden w-full bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800 sticky top-0 z-40 no-print">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-md shadow-sm">
            F
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-md">
            FocusFlow<span className="text-primary-500 font-extrabold">AI</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-805 text-slate-500 dark:text-slate-400"
          >
            {themeMode === 'dark' ? <IoSunnyOutline className="w-4 h-4" /> : <IoMoonOutline className="w-4 h-4" />}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-805 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950"
          >
            {isOpen ? <IoCloseOutline className="w-5 h-5" /> : <IoMenuOutline className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Slide-out mobile drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-950/45 text-primary-600 dark:text-primary-400 font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-955'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
