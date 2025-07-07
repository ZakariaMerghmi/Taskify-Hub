import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../contextAPI";
import LatestProjects from "./LatestProject";
import { collection, getDocs } from "firebase/firestore";
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

  const fetchProjectsAndCalculateProgress = async () => {
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));

      // Calculate overall progress
      let totalCompleted = 0;
      let totalTasks = 0;

      data.forEach(project => {
        const progress = project.progress ?? { completed: 0, total: 1 };
        totalCompleted += progress.completed;
        totalTasks += progress.total;
      });

      const percentage = totalTasks > 0 ? Math.floor((totalCompleted / totalTasks) * 100) : 0;
      setOverallPercentage(percentage);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setOverallPercentage(0);
    }
  };

  useEffect(() => {
    fetchProjectsAndCalculateProgress();
    
    const handleProjectDeleted = () => {
      fetchProjectsAndCalculateProgress();
    };
    
    window.addEventListener("projectDeleted", handleProjectDeleted);
    return () => {
      window.removeEventListener("projectDeleted", handleProjectDeleted);
    };
  }, []);

  return (
    <div className={`mt-1 rounded-md p-4 h-64 flex gap-8 flex-col items-center justify-center ${
        isdark ? `bg-blue-950` : `bg-white `
      }`}>
      <span className="font-semibold text-lg">Overall Progress</span>
      <div className="rounded-full bg-blue-500 w-[120px] h-[120px] flex flex-col items-center justify-center gap-2">
          <span className="font-bold text-3xl text-white">{overallPercentage}%</span>
          <span className="font-light text-white text-[11px]">Progress</span>
      </div>
    </div>
  );
}