"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../src/firebase"; 
import SingleTask from "./SingleTask";
import { useGlobalContext } from "../contextAPI";
import AddTaskCard from "./AddTaskCard";

interface Task {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: any; 
  projectId?: string;
}

interface TaskAreaProps {
  selectedProject?: any;
  onTaskUpdate?: () => Promise<void>;
}


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


  const fetchTasks = async () => {
    try {
      setLoading(true);
      let tasksQuery;
      
      if (selectedProject?.id) {
     
        tasksQuery = query(
          collection(db, "tasks"),
          where("projectId", "==", selectedProject.id)
        );
      } else {
       
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
    
    
    const handleTaskAdded = () => {
      fetchTasks();
    };
    
    window.addEventListener("taskAdded", handleTaskAdded);
    return () => {
      window.removeEventListener("taskAdded", handleTaskAdded);
    };
  }, [selectedProject?.id]); 

  
  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'createdAt':
  
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
    
      <div className="flex items-center justify-between mb-4">
       
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-lg">
            {selectedProject ? `${selectedProject.name} Tasks` : 'All Tasks'}
          </h2>
          <button
            onClick={() => setOpenNewTaskBox(true)}
            className="flex items-center gap-2 text-sm py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-purple-500 text-white hover:from-orange-600 hover:to-yellow-600 active:scale-95 transition-all"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span className="hidden md:inline">Add new</span>
          </button>
        </div>

      
        <div className="relative sort-dropdown">
          <div 
            className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-opacity-10 
             
            `}
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            <span>Sort by:</span>
            <div className="flex items-center gap-1 text-orange-500 font-medium">
              <span className="capitalize">{sortBy === 'createdAt' ? 'Date' : sortBy}</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`text-xs transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>

         
          {sortDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-32 rounded-md shadow-lg py-1 z-10 border ${
              isdark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
            }`}>
              <button 
                onClick={() => handleSortChange('name')}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  sortBy === 'name' ? 'bg-orange-500 text-white' : ''
                }`}
              >
                Name
              </button>
              <button 
                onClick={() => handleSortChange('priority')}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  sortBy === 'priority' ? 'bg-orange-500 text-white' : ''
                } ${isdark ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
              >
                Priority
              </button>
              <button 
                onClick={() => handleSortChange('createdAt')}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  sortBy === 'createdAt' ? 'bg-orange-500 text-white' : ''
                } ${isdark ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
              >
                Date
              </button>
            </div>
          )}
        </div>
      </div>

     
      <div className="mt-6 flex flex-col gap-3 h-[calc(100%-80px)] overflow-y-auto">
        {loading ? (
         
          <div className={`text-center italic text-sm mt-10 ${
            isdark ? "text-slate-400" : "text-gray-600"
          }`}>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
         
          <div className={`text-center italic text-sm mt-10 ${
            isdark ? "text-slate-400" : "text-gray-600"
          }`}>
            {selectedProject 
              ? `No tasks in ${selectedProject.name} yet. Click "Add new" to create one.`
              : 'No tasks yet. Click "Add new" to create one.'
            }
          </div>
        ) : (
         
          sortedTasks.map((task) => (
            <SingleTask 
              key={task.id} 
              task={task}
              onTaskUpdate={fetchTasks}
            />
          ))
        )}
      </div>

      
      <AddTaskCard selectedProject={selectedProject} />
    </div>
  );
}