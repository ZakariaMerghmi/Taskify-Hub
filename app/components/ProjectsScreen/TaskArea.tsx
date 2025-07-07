"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../src/firebase"; // adjust the path
import SingleTask from "./SingleTask";
import { useGlobalContext } from "../contextAPI";
import AddTaskCard from "./AddTaskCard";

interface Task {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: any; // Firebase timestamp
  projectId?: string;
}

interface TaskAreaProps {
  selectedProject?: any;
  onTaskUpdate?: () => Promise<void>; // Added this prop to fix TypeScript error
}

// Define the props interface for SingleTask
interface SingleTaskProps {
  task: Task;
  onTaskUpdate: () => Promise<void>;
}

export default function TaskArea({ selectedProject, onTaskUpdate }: TaskAreaProps) {
  const { taskwindow, isdark } = useGlobalContext();
  const { setOpenNewTaskBox } = taskwindow;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'createdAt'>('name');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Fetch tasks from Firebase - now properly filtered by project
  const fetchTasks = async () => {
    try {
      setLoading(true);
      let tasksQuery;
      
      if (selectedProject?.id) {
        // Fetch tasks for specific project
        tasksQuery = query(
          collection(db, "tasks"),
          where("projectId", "==", selectedProject.id)
        );
      } else {
        // Fetch tasks without projectId (general tasks)
        tasksQuery = query(
          collection(db, "tasks"),
          where("projectId", "==", null)
        );
      }
      
      const snapshot = await getDocs(tasksQuery);
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Task[];
      setTasks(data);
      
      // Call the parent's onTaskUpdate if provided to keep ProjectWindow in sync
      if (onTaskUpdate) {
        await onTaskUpdate();
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    
    // Listen for task additions/updates
    const handleTaskAdded = () => {
      fetchTasks();
    };
    
    window.addEventListener("taskAdded", handleTaskAdded);
    return () => {
      window.removeEventListener("taskAdded", handleTaskAdded);
    };
  }, [selectedProject?.id]); // Re-fetch when selectedProject.id changes

  // Sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'createdAt':
        // Handle cases where createdAt might be null/undefined
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      default:
        return 0;
    }
  });

  const handleSortChange = (newSort: 'name' | 'priority' | 'createdAt') => {
    setSortBy(newSort);
    setSortDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.sort-dropdown')) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="rounded-xl p-4 md:p-6 h-full">
      {/* Top Section: Header + Add Button + Sorting */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Title and Add New */}
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-lg">
            {selectedProject ? `${selectedProject.name} Tasks` : 'All Tasks'}
          </h2>
          <button
            onClick={() => setOpenNewTaskBox(true)}
            className="flex items-center gap-2 text-sm py-2 px-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 active:scale-95 transition-all"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span className="hidden md:inline">Add new</span>
          </button>
        </div>

        {/* Right: Sort By Dropdown */}
        <div className="relative sort-dropdown">
          <div 
            className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-opacity-10 
             
            `}
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            <span>Sort by:</span>
            <div className="flex items-center gap-1 text-blue-500 font-medium">
              <span className="capitalize">{sortBy === 'createdAt' ? 'Date' : sortBy}</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`text-xs transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>

          {/* Dropdown Options */}
          {sortDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-32 rounded-md shadow-lg py-1 z-10 border ${
              isdark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
            }`}>
              <button 
                onClick={() => handleSortChange('name')}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  sortBy === 'name' ? 'bg-blue-500 text-white' : ''
                }`}
              >
                Name
              </button>
              <button 
                onClick={() => handleSortChange('priority')}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  sortBy === 'priority' ? 'bg-blue-500 text-white' : ''
                } ${isdark ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
              >
                Priority
              </button>
              <button 
                onClick={() => handleSortChange('createdAt')}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  sortBy === 'createdAt' ? 'bg-blue-500 text-white' : ''
                } ${isdark ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
              >
                Date
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task List or Empty State */}
      <div className="mt-6 flex flex-col gap-3 h-[calc(100%-80px)] overflow-y-auto">
        {loading ? (
          // Loading state
          <div className={`text-center italic text-sm mt-10 ${
            isdark ? "text-slate-400" : "text-gray-600"
          }`}>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          // Empty state
          <div className={`text-center italic text-sm mt-10 ${
            isdark ? "text-slate-400" : "text-gray-600"
          }`}>
            {selectedProject 
              ? `No tasks in ${selectedProject.name} yet. Click "Add new" to create one.`
              : 'No tasks yet. Click "Add new" to create one.'
            }
          </div>
        ) : (
          // Task list
          sortedTasks.map((task) => (
            <SingleTask 
              key={task.id} 
              task={task}
              onTaskUpdate={fetchTasks}
            />
          ))
        )}
      </div>

      {/* Add Task Card (input form) */}
      <AddTaskCard selectedProject={selectedProject} />
    </div>
  );
}