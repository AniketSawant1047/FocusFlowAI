import React, { useState } from 'react';
import Calendar from '../components/Calendar/Calendar';
import Modal from '../components/Modal/Modal';
import TaskForm from '../components/TaskForm/TaskForm';

export default function CalendarPage({ onToast }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleSelectTask = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleAddTaskOnDate = (dateStr) => {
    setTaskToEdit({ dueDate: dateStr });
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Calendar Planner
        </h1>
        <p className="text-slate-400 dark:text-slate-400 text-sm font-medium mt-1">
          Review, click, and create tasks organized by monthly due dates.
        </p>
      </div>

      {/* Interactive Month Grid */}
      <Calendar 
        onSelectTask={handleSelectTask} 
        onAddTaskOnDate={handleAddTaskOnDate} 
      />

      {/* Task Creation/Modification Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={taskToEdit && taskToEdit.title ? 'Modify Task Details' : 'Create New Focus Task'}
      >
        <TaskForm
          taskToEdit={taskToEdit}
          onClose={() => setIsFormOpen(false)}
          onToast={onToast}
        />
      </Modal>
    </div>
  );
}
