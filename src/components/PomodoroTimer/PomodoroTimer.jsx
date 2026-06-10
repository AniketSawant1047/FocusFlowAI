import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFocusSession } from '../../redux/analyticsSlice';
import { incrementTaskPomodoro } from '../../redux/taskSlice';
import { unlockAchievement } from '../../redux/userSlice';
import useTimer from '../../hooks/useTimer';
import { 
  IoPlay, 
  IoPause, 
  IoRefreshOutline, 
  IoAttachOutline, 
  IoFlame 
} from 'react-icons/io5';

/**
 * Pomodoro Focus Clock widget.
 * @param {object} activeTask - Externally attached task.
 * @param {Function} onClearActiveTask - Callback to clear attachment.
 * @param {Function} onToast - Toast message trigger.
 */
export default function PomodoroTimer({ activeTask = null, onClearActiveTask, onToast }) {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const analytics = useSelector((state) => state.analytics);

  const {
    secondsLeft,
    isRunning,
    mode,
    attachedTaskId,
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
    attachTask
  } = useTimer(1500); // 25 mins

  const [localActiveTask, setLocalActiveTask] = useState(null);

  // Sync prop changes to hook state
  useEffect(() => {
    if (activeTask) {
      attachTask(activeTask.id);
      setLocalActiveTask(activeTask);
    }
  }, [activeTask, attachTask]);

  // Sync state if attachedTaskId changes
  useEffect(() => {
    if (attachedTaskId) {
      const task = tasks.find(t => t.id === attachedTaskId);
      setLocalActiveTask(task || null);
    } else {
      setLocalActiveTask(null);
    }
  }, [attachedTaskId, tasks]);

  // Web Audio API Synthesizer buzzer sound
  const playAlertBuzzer = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Beep sequence
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 523.25; // C5 pitch
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Synth error:', e);
    }
  };

  // Timer complete actions
  useEffect(() => {
    if (secondsLeft === 0) {
      playAlertBuzzer();
      
      if (mode === 'focus') {
        const sessionMinutes = 25;
        dispatch(addFocusSession(sessionMinutes));
        
        if (localActiveTask) {
          dispatch(incrementTaskPomodoro(localActiveTask.id));
        }

        if (onToast) {
          onToast(
            `Excellent job! Focus session completed on "${
              localActiveTask ? localActiveTask.title : 'Task'
            }". Take a short break!`,
            'success'
          );
        }

        // Achievements triggers
        const nextPomodorosTotal = analytics.pomodorosCompleted + 1;
        if (nextPomodorosTotal >= 10) {
          dispatch(unlockAchievement('productivity_master'));
        }

        // Move to break mode automatically
        changeMode('shortBreak');
      } else {
        if (onToast) onToast('Break completed! Ready to focus?', 'info');
        changeMode('focus');
      }
    }
  }, [secondsLeft, mode, localActiveTask, dispatch, onToast, changeMode, analytics.pomodorosCompleted]);

  // Clock time formatter
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter tasks to attach
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  const handleSelectTask = (e) => {
    const taskId = e.target.value;
    if (taskId) {
      attachTask(taskId);
      if (onToast) {
        const task = tasks.find(t => t.id === taskId);
        onToast(`Attached Pomodoro to: "${task.title}"`, 'info');
      }
    } else {
      attachTask(null);
      if (onClearActiveTask) onClearActiveTask();
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-xl card-shadow flex flex-col items-center">
      {/* Tab Selectors */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full mb-6">
        <button
          onClick={() => changeMode('focus')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'focus'
              ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => changeMode('shortBreak')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'shortBreak'
              ? 'bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => changeMode('longBreak')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'longBreak'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          Long Break
        </button>
      </div>

      {/* Timer Circular visual clock */}
      <div className="relative w-48 h-48 rounded-full flex items-center justify-center border-4 border-slate-100 dark:border-slate-800 mb-6 bg-slate-50 dark:bg-slate-950/20">
        <div className="text-center">
          <span className="text-4xl font-bold font-mono text-slate-800 dark:text-white tracking-wider">
            {formatTime(secondsLeft)}
          </span>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
            {mode === 'focus' ? 'Session' : 'Break'}
          </p>
        </div>

        {/* Pulsing ring indicator when ticking */}
        {isRunning && (
          <div className="absolute inset-0 rounded-full border-4 border-primary-500/35 animate-ping opacity-20 pointer-events-none" />
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={resetTimer}
          className="p-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
          title="Reset timer"
        >
          <IoRefreshOutline className="w-5 h-5" />
        </button>

        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className={`px-8 py-3 rounded-full text-white font-semibold transition-all flex items-center gap-2 shadow-md ${
            isRunning
              ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-700/20'
              : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/20'
          }`}
        >
          {isRunning ? (
            <>
              <IoPause className="w-5 h-5" /> Pause
            </>
          ) : (
            <>
              <IoPlay className="w-5 h-5" /> Start
            </>
          )}
        </button>
      </div>

      {/* Task Attachment Sector */}
      <div className="w-full border-t border-slate-150 dark:border-slate-800 pt-4">
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
          <IoAttachOutline className="w-4 h-4 text-primary-500" />
          <span>ATTACHED TASK</span>
        </div>

        {localActiveTask ? (
          <div className="p-3 bg-slate-50 dark:bg-slate-950/45 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
              {localActiveTask.title}
            </span>
            <button
              onClick={() => {
                attachTask(null);
                if (onClearActiveTask) onClearActiveTask();
              }}
              className="text-red-500 font-bold hover:underline"
            >
              Detach
            </button>
          </div>
        ) : (
          <select
            onChange={handleSelectTask}
            value=""
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-600 dark:text-slate-400 focus:border-primary-500"
          >
            <option value="">-- Attach a pending task --</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
