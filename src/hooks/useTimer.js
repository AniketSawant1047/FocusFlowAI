import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to control Pomodoro timer ticking and configuration.
 * @param {number} defaultFocusSeconds - Focus interval in seconds (default 25m = 1500s).
 */
export default function useTimer(defaultFocusSeconds = 1500) {
  const [secondsLeft, setSecondsLeft] = useState(defaultFocusSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [attachedTaskId, setAttachedTaskId] = useState(null);
  const intervalRef = useRef(null);

  // Synchronize timer duration when mode changes
  const getDurationForMode = (targetMode) => {
    switch (targetMode) {
      case 'shortBreak':
        return 300; // 5 mins
      case 'longBreak':
        return 900; // 15 mins
      case 'focus':
      default:
        return defaultFocusSeconds;
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = (newDuration = null) => {
    setIsRunning(false);
    setSecondsLeft(newDuration !== null ? newDuration : getDurationForMode(mode));
  };

  const changeMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(getDurationForMode(newMode));
  };

  const attachTask = (taskId) => {
    setAttachedTaskId(taskId);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            clearInterval(intervalRef.current);
            return 0; // Completed
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return {
    secondsLeft,
    isRunning,
    mode,
    attachedTaskId,
    setSecondsLeft,
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
    attachTask
  };
}
