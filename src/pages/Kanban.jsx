import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTask, deleteTask, duplicateTask } from '../redux/taskSlice';
import TaskCard from '../components/TaskCard/TaskCard';
import Modal from '../components/Modal/Modal';
import TaskForm from '../components/TaskForm/TaskForm';
import { IoAdd, IoEllipsisHorizontalOutline } from 'react-icons/io5';

export default function Kanban({ onToast }) {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);

  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Grouping tasks by status
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Drag and Drop event handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (draggedOverColumn !== columnId) {
      setDraggedOverColumn(columnId);
    }
  };

  const handleDragLeave = (e) => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== targetStatus) {
      dispatch(updateTask({ id: taskId, status: targetStatus }));
      if (onToast) {
        let statusLabel = 'Todo';
        if (targetStatus === 'in-progress') statusLabel = 'In Progress';
        if (targetStatus === 'completed') statusLabel = 'Completed';
        onToast(`Moved "${task.title}" to ${statusLabel}`, 'success');
      }
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleAddClick = (status) => {
    setTaskToEdit({ status }); // pre-fill status
    setIsFormOpen(true);
  };

  const columns = [
    { id: 'todo', title: 'To Do', list: todoTasks, color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/50' },
    { id: 'in-progress', title: 'In Progress', list: inProgressTasks, color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200/50' },
    { id: 'completed', title: 'Completed', list: completedTasks, color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200/50' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Kanban Board
        </h1>
        <p className="text-slate-400 dark:text-slate-400 text-sm font-medium mt-1">
          Drag and drop tasks across lanes to manage workflows seamlessly.
        </p>
      </div>

      {/* Board Lane Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {columns.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col max-h-[80vh] rounded-2xl border transition-all p-4 duration-300 ${
              draggedOverColumn === col.id
                ? 'bg-slate-100/70 dark:bg-slate-950/40 border-primary-500 border-dashed scale-[1.01]'
                : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800'
            } card-shadow`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${col.color}`}>
                  {col.list.length}
                </span>
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                  {col.title}
                </h3>
              </div>

              {/* Header Action Menu */}
              <button 
                onClick={() => handleAddClick(col.id)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors"
                title="Add task to this lane"
              >
                <IoAdd className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Draggable Cards Stack */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[250px]">
              {col.list.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs italic border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl">
                  Empty Lane. Drop tasks here
                </div>
              ) : (
                col.list.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard
                      task={task}
                      onEdit={handleEditClick}
                      onToast={onToast}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form Modal */}
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
