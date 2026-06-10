import React from 'react';

/**
 * Custom progress bar indicator.
 * @param {number} value - The current level.
 * @param {number} max - The maximum level (defaults to 100).
 * @param {string} colorClass - Tailwind color class overriding default violet.
 * @param {boolean} showLabel - Controls percentage text display.
 */
export default function ProgressBar({ value = 0, max = 100, colorClass = 'bg-primary-500', showLabel = false }) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        {showLabel && (
          <>
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span className="text-primary-600 dark:text-primary-400">{percentage}%</span>
          </>
        )}
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
