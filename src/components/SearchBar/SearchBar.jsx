import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setFilter, addTask } from '../../redux/taskSlice';
import { parseVoiceCommand, VoiceListener } from '../../utils/voice';
import { IoSearch, IoMic, IoMicOff, IoClose } from 'react-icons/io5';

export default function SearchBar({ onToast }) {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.tasks.searchQuery);
  const filter = useSelector((state) => state.tasks.filter);
  const categories = useSelector((state) => state.tasks.categories);

  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [listener, setListener] = useState(null);

  // Initialize Speech recognition
  useEffect(() => {
    const handleVoiceResult = (transcript) => {
      setIsListening(false);
      
      const lowerTranscript = transcript.toLowerCase();
      if (lowerTranscript.startsWith('add task') || lowerTranscript.includes('add')) {
        // Parse task details using voice util
        const parsedTask = parseVoiceCommand(transcript);
        const newTask = {
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'todo',
          pomodoros: 0,
          description: 'Added via voice command.',
          ...parsedTask
        };
        
        dispatch(addTask(newTask));
        if (onToast) {
          onToast(`Added task: "${newTask.title}" via voice command!`, 'success');
        }
      } else {
        // Just populate the search query
        dispatch(setSearchQuery(transcript));
        if (onToast) {
          onToast(`Searching for: "${transcript}"`, 'info');
        }
      }
    };

    const handleVoiceError = (error) => {
      setIsListening(false);
      console.error('Speech recognition error:', error);
      if (onToast) {
        onToast(`Voice input failed: ${error}`, 'error');
      }
    };

    const voice = new VoiceListener(handleVoiceResult, handleVoiceError);
    setListener(voice);

    return () => {
      if (voice) voice.stop();
    };
  }, [dispatch, onToast]);

  const handleMicClick = () => {
    if (!listener || !listener.recognition) {
      if (onToast) onToast('Voice recognition is not supported in this browser.', 'error');
      return;
    }

    if (isListening) {
      listener.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      listener.start();
      if (onToast) onToast('Listening... Speak a command (e.g. "Add task Plan project tomorrow")', 'info');
    }
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  const filterTabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'high', label: 'High Priority' },
    { id: 'today', label: "Today's" },
    { id: 'overdue', label: 'Overdue' }
  ];

  return (
    <div className="space-y-4">
      {/* Search Input Controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search by title, description or tag..."
            className="w-full pl-12 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm card-shadow"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
            >
              <IoClose className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Microphone Button */}
        <button
          onClick={handleMicClick}
          className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
            isListening
              ? 'bg-red-500 border-red-500 text-white animate-pulse'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary-500 dark:text-slate-450 hover:bg-slate-55'
          } card-shadow`}
          title="Voice command parsing: Add task Learn Docker tomorrow"
        >
          {isListening ? <IoMicOff className="w-5 h-5" /> : <IoMic className="w-5 h-5" />}
        </button>
      </div>

      {/* Filter Tabs Grid */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setFilter(tab.id))}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Help Tip */}
        <div className="hidden lg:block text-xs text-slate-400 italic">
          Tip: Tap mic & say <span className="font-semibold text-primary-500">"Add task Buy groceries tomorrow high priority"</span>
        </div>
      </div>
    </div>
  );
}
