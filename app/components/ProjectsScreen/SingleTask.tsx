
"use client";
import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from "../../../src/firebase";

interface Task {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: any;
  projectId?: string;
}

interface SingleTaskProps {
  task: Task;
  onTaskUpdate: () => Promise<void>;
  selectedProject?: any; 
}

export default function SingleTask({ task, onTaskUpdate, selectedProject }: SingleTaskProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        completed: !task.completed
      });
      await onTaskUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, 'tasks', task.id));
        await onTaskUpdate();
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={isLoading}
          className="w-4 h-4"
        />
        <div className="flex items-center gap-2">
          <span className={`text-sm ${task.completed ? 'line-through opacity-60' : ''}`}>
            {task.name}
          </span>
          <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
        </div>
      </div>
      
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
}