import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../contextAPI";
import LatestProjects from "./LatestProject";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../src/firebase"; // adjust the path

// Define the project type
interface ProjectProgress {
  completed: number;
  total: number;
}

interface Project {
  id: string;
  name?: string;
  icon?: string;
  category?: string;
  categories?: string[];
  progress?: ProjectProgress;
  [key: string]: any;
}

interface Task {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: any;
  projectId?: string;
}

export default function RightSidebar() {
  const { isdark, Mobileview } = useGlobalContext();
  const { ismobileview, setIsmobileview } = Mobileview;
  return (
    <div className={`${ismobileview ? "" : "w-4/12"}  p-4 flex gap-4 flex-col`}>
      <OverallProgress />
      <LatestProjects />
    </div>
  );
}

function OverallProgress() {
  const { isdark } = useGlobalContext();
  const [overallPercentage, setOverallPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchProjectsAndCalculateProgress = async () => {
    try {
      setLoading(true);
      
      // Fetch all projects
      const projectsSnapshot = await getDocs(collection(db, "projects"));
      const projects = projectsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Project));

      // Fetch all tasks
      const tasksSnapshot = await getDocs(collection(db, "tasks"));
      const tasks = tasksSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Task));

      // Calculate progress for each project and overall
      let totalCompleted = 0;
      let totalTasks = 0;

      // Count general tasks (tasks without projectId)
      const generalTasks = tasks.filter(task => !task.projectId);
      const completedGeneralTasks = generalTasks.filter(task => task.completed);
      
      totalTasks += generalTasks.length;
      totalCompleted += completedGeneralTasks.length;

      // Count tasks for each project
      projects.forEach(project => {
        const projectTasks = tasks.filter(task => task.projectId === project.id);
        const completedProjectTasks = projectTasks.filter(task => task.completed);
        
        totalTasks += projectTasks.length;
        totalCompleted += completedProjectTasks.length;
      });

      const percentage = totalTasks > 0 ? Math.floor((totalCompleted / totalTasks) * 100) : 0;
      setOverallPercentage(percentage);
    } catch (error) {
      console.error("Error fetching projects and tasks:", error);
      setOverallPercentage(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndCalculateProgress();
    
    // Listen for various events that might affect overall progress
    const handleProgressUpdate = () => {
      fetchProjectsAndCalculateProgress();
    };
    
    // Listen for task-related events
    window.addEventListener("taskAdded", handleProgressUpdate);
    window.addEventListener("taskDeleted", handleProgressUpdate);
    window.addEventListener("taskCompleted", handleProgressUpdate);
    window.addEventListener("tasksUpdated", handleProgressUpdate);
    
    // Listen for project-related events
    window.addEventListener("projectDeleted", handleProgressUpdate);
    window.addEventListener("projectAdded", handleProgressUpdate);
    window.addEventListener("projectUpdated", handleProgressUpdate);
    
    return () => {
      window.removeEventListener("taskAdded", handleProgressUpdate);
      window.removeEventListener("taskDeleted", handleProgressUpdate);
      window.removeEventListener("taskCompleted", handleProgressUpdate);
      window.removeEventListener("tasksUpdated", handleProgressUpdate);
      window.removeEventListener("projectDeleted", handleProgressUpdate);
      window.removeEventListener("projectAdded", handleProgressUpdate);
      window.removeEventListener("projectUpdated", handleProgressUpdate);
    };
  }, []);

  return (
    <div className={`mt-1 rounded-md p-4 h-64 flex gap-8 flex-col items-center justify-center ${
        isdark ? `bg-blue-950` : `bg-white `
      }`}>
      <span className="font-semibold text-lg">Overall Progress</span>
      <div className="rounded-full bg-blue-500 w-[120px] h-[120px] flex flex-col items-center justify-center gap-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="font-light text-white text-[11px]">Loading...</span>
          </div>
        ) : (
          <>
            <span className="font-bold text-3xl text-white">{overallPercentage}%</span>
            <span className="font-light text-white text-[11px]">Progress</span>
          </>
        )}
      </div>
    </div>
  );
}