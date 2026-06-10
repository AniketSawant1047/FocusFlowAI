import React from 'react';
import { Link } from 'react-router-dom';
import { IoPlanetOutline } from 'react-icons/io5';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="relative">
        <IoPlanetOutline className="w-24 h-24 text-primary-500 animate-pulse" />
        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl -z-10" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Lost in Orbit</h2>
        <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm">
          The productivity coordinate you are looking for does not exist or has been archived.
        </p>
      </div>

      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all shadow-md shadow-primary-500/20"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
