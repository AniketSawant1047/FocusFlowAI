/**
 * Helper to parse natural language voice commands.
 * Examples: 
 * - "Add task Learn Docker tomorrow"
 * - "Add task Gym session high priority personal"
 * - "Add task Math exam next monday study"
 */
export function parseVoiceCommand(transcript) {
  const text = transcript.toLowerCase().trim();
  
  // Base task object
  let task = {
    title: '',
    dueDate: new Date().toISOString().split('T')[0], // default today
    priority: 'medium', // default medium
    category: 'Personal', // default personal
  };

  // Check if it starts with "add task"
  let cleanText = text;
  if (text.startsWith('add task')) {
    cleanText = text.replace(/^add task\s+/, '');
  }

  // Parse priority
  if (cleanText.includes('high priority') || cleanText.includes('priority high')) {
    task.priority = 'high';
    cleanText = cleanText.replace(/high priority|priority high/g, '');
  } else if (cleanText.includes('low priority') || cleanText.includes('priority low')) {
    task.priority = 'low';
    cleanText = cleanText.replace(/low priority|priority low/g, '');
  } else if (cleanText.includes('medium priority') || cleanText.includes('priority medium')) {
    task.priority = 'medium';
    cleanText = cleanText.replace(/medium priority|priority medium/g, '');
  }

  // Parse categories
  const categories = ['work', 'study', 'personal', 'fitness', 'finance', 'shopping'];
  for (const cat of categories) {
    const regex = new RegExp(`\\bcategory ${cat}\\b|\\b${cat} category\\b|\\bcategory: ${cat}\\b`, 'i');
    if (regex.test(cleanText)) {
      task.category = cat.charAt(0).toUpperCase() + cat.slice(1);
      cleanText = cleanText.replace(regex, '');
      break;
    }
  }
  // Alternate simpler check: if it just mentions the word
  for (const cat of categories) {
    if (cleanText.includes(` ${cat}`)) {
      task.category = cat.charAt(0).toUpperCase() + cat.slice(1);
      cleanText = cleanText.replace(new RegExp(`\\b${cat}\\b`, 'g'), '');
      break;
    }
  }

  // Parse dates
  const today = new Date();
  if (cleanText.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    task.dueDate = tomorrow.toISOString().split('T')[0];
    cleanText = cleanText.replace(/\btomorrow\b/g, '');
  } else if (cleanText.includes('today')) {
    task.dueDate = today.toISOString().split('T')[0];
    cleanText = cleanText.replace(/\btoday\b/g, '');
  } else if (cleanText.includes('next week')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    task.dueDate = nextWeek.toISOString().split('T')[0];
    cleanText = cleanText.replace(/\bnext week\b/g, '');
  } else if (cleanText.includes('next monday')) {
    const nextMonday = new Date(today);
    const day = today.getDay();
    const daysToAdd = day === 0 ? 1 : 8 - day; // If sunday, add 1, otherwise add to next monday
    nextMonday.setDate(today.getDate() + daysToAdd);
    task.dueDate = nextMonday.toISOString().split('T')[0];
    cleanText = cleanText.replace(/\bnext monday\b/g, '');
  } else if (cleanText.includes('next friday')) {
    const nextFriday = new Date(today);
    const day = today.getDay();
    const daysToAdd = day <= 5 ? (5 - day) : (12 - day);
    nextFriday.setDate(today.getDate() + daysToAdd);
    task.dueDate = nextFriday.toISOString().split('T')[0];
    cleanText = cleanText.replace(/\bnext friday\b/g, '');
  }

  // The remaining text is the title
  task.title = cleanText
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter

  // Fallback if title gets emptied
  if (!task.title) {
    task.title = 'Voice Task';
  }

  return task;
}

/**
 * Speech recognition class helper (Web Speech API wrapper)
 */
export class VoiceListener {
  constructor(onResultCallback, onErrorCallback) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResultCallback(transcript);
      };

      this.recognition.onerror = (event) => {
        onErrorCallback(event.error);
      };
    } else {
      this.recognition = null;
      console.warn('Speech Recognition API is not supported in this browser.');
    }
  }

  start() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
