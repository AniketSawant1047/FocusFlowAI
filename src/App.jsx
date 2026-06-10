import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Kanban from './pages/Kanban';
import CalendarPage from './pages/CalendarPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const themeMode = useSelector((state) => state.theme.mode);
  const [toast, setToast] = useState(null);

  // Sync theme mode on mount & change
  useEffect(() => {
    if (themeMode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [themeMode]);

  // Handle toast notifications
  const handleToast = (message, type = 'success', action = null) => {
    setToast({ message, type, action });
  };

  // Auto hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getToastColors = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'success':
      default:
        return 'bg-primary-600 text-white';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sticky desktop side navigation */}
      <Sidebar />

      {/* Top mobile header */}
      <Navbar />

      {/* Main page content workspace */}
      <main className="flex-1 px-4 py-6 md:p-8 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard onToast={handleToast} />} />
            <Route path="/tasks" element={<Tasks onToast={handleToast} />} />
            <Route path="/kanban" element={<Kanban onToast={handleToast} />} />
            <Route path="/calendar" element={<CalendarPage onToast={handleToast} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings onToast={handleToast} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      {/* Slide-in Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none no-print">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-2xl shadow-xl pointer-events-auto flex items-center justify-between gap-4 max-w-sm w-80 text-xs font-semibold ${getToastColors(
                toast.type
              )}`}
            >
              <div className="flex-1">{toast.message}</div>
              
              {/* Undo action button */}
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action.action();
                    setToast(null);
                  }}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] uppercase tracking-wider font-extrabold transition-all"
                >
                  {toast.action.label}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
