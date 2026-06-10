import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

/**
 * Reusable modal overlay using Framer Motion.
 * @param {boolean} isOpen - Control modal display state.
 * @param {Function} onClose - Close callback.
 * @param {string} title - Title text of the modal window.
 * @param {React.ReactNode} children - Contents.
 */
export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="glass w-full max-w-lg bg-white/95 dark:bg-slate-900/95 shadow-2xl rounded-2xl overflow-hidden z-10 border border-slate-200/50 dark:border-slate-800/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50">
              <h3 className="font-semibold text-lg text-slate-850 dark:text-slate-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
