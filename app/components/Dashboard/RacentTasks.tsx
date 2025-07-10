
"use client";
import { useGlobalContext } from "../contextAPI";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db } from "../../../src/firebase";

interface RecentTask {
  id: string;
  TaskName: string;
  Createdat: string;
  ProjectName: string;
  status: string;
  projectId?: string;
  completed: boolean;
}

interface Project {
  id: string;
  name: string;
}

export default function RecentTasks() {
  const [currentWidth, setCurrentWidth] = useState<number>(0);
  const [recentTaskArray, setRecentTaskArray] = useState<RecentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setCurrentWidth(window.innerWidth);
    
    function handleWidth() {
      setCurrentWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleWidth);
    return () => {
      window.removeEventListener("resize", handleWidth);
    }
  }, []);

 
  const fetchProjectName = async (projectId: string): Promise<string> => {
    try {
      const projectDoc = await getDoc(doc(db, "projects", projectId));
      if (projectDoc.exists()) {
        return projectDoc.data().name || "Unknown Project";
      }
      return "Unknown Project";
    } catch (error) {
      console.error("Error fetching project:", error);
      return "Unknown Project";
    }
  };


  useEffect(() => {
    const fetchRecentTasks = async () => {
      setLoading(true);
      try {
        const tasksQuery = query(
          collection(db, "tasks"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        
        const snapshot = await getDocs(tasksQuery);
        const tasksPromises = snapshot.docs.map(async (taskDoc) => {
          const data = taskDoc.data();
          let projectName = "General Tasks"; 
          
         
          if (data.projectId) {
            projectName = await fetchProjectName(data.projectId);
          }
          
          return {
            id: taskDoc.id,
            TaskName: data.name || "Untitled Task",
            Createdat: data.createdAt?.toDate?.()?.toLocaleDateString() || 
                      new Date().toLocaleDateString(),
            ProjectName: projectName,
            status: data.completed ? "Completed" : "Pending",
            projectId: data.projectId || null,
            completed: data.completed || false
          };
        });
        
        const tasks = await Promise.all(tasksPromises);
        setRecentTaskArray(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setRecentTaskArray([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTasks();
  }, [refreshTrigger]); 

  
  useEffect(() => {
    const handleRefreshTasks = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    
    window.addEventListener('tasksUpdated', handleRefreshTasks);
    window.addEventListener('taskAdded', handleRefreshTasks);
    window.addEventListener('taskDeleted', handleRefreshTasks);
    window.addEventListener('taskCompleted', handleRefreshTasks);
    
    return () => {
      window.removeEventListener('tasksUpdated', handleRefreshTasks);
      window.removeEventListener('taskAdded', handleRefreshTasks);
      window.removeEventListener('taskDeleted', handleRefreshTasks);
      window.removeEventListener('taskCompleted', handleRefreshTasks);
    };
  }, []);

  const { isdark } = useGlobalContext();

  if (loading) {
    return (
      <div className={`p-4 rounded-md py-8 m-5 ${
          isdark ? "bg-blue-950" : "bg-white"
      }`}>
        <div className="font-semibold text-lg ml-5 mb-12">Recent Tasks</div>
        <div className="text-center text-gray-400 text-sm">Loading tasks...</div>
      </div>
    );
  }

  if (currentWidth === 0) {
    return (
      <div className={`p-4 rounded-md py-8 m-5 ${
          isdark ? "bg-blue-950" : "bg-white"
      }`}>
        <div className="font-semibold text-lg ml-5 mb-12">Recent Tasks</div>
        {recentTaskArray.map((task) => (
          <div key={task.id} className={`px-6 rounded-md m-5 grid grid-cols-3 md:grid-cols-4 items-center p-3 border ${
              isdark ? "bg-blue-900 border-blue-800" : "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex flex-col gap-1">
              <span className={`font-semibold ${task.completed ? 'line-through opacity-60' : ''}`}>
                {task.TaskName}
              </span>
              <span className="font-medium text-blue-500 text-[15px] hidden md:block">
                {task.Createdat}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className={`font-semibold text-[14px] ${
                  isdark ? "text-white" : "text-gray-500"
              }`}>
                Project In
              </span>
              <span className="font-medium text-blue-500 text-[15px]">
                {task.ProjectName}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className={`font-semibold text-[14px] ${
                  isdark ? "text-white" : "text-gray-500"
              }`}>
                Status
              </span>
              <span className={`font-medium text-[15px] ${
                task.status === "Completed" ? "text-green-500" : "text-orange-500"
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-md py-8 m-5 ${
        isdark ? "bg-blue-950" : "bg-white"
    }`}>
      <div className="font-semibold text-lg ml-5 mb-12">Recent Tasks</div>
      {recentTaskArray.length > 0 ? (
        recentTaskArray.map((task) => {
          return <Task key={task.id} recentTaskprop={task} currentWidth={currentWidth}/>
        })
      ) : (
        <EmptyTasks/>
      )} 
    </div>
  );
}

function Task({recentTaskprop, currentWidth}: {recentTaskprop: RecentTask, currentWidth: number}) {
  const {TaskName, Createdat, ProjectName, status, completed} = recentTaskprop;
  const {isdark, Mobileview} = useGlobalContext();
  
  const getStatusColor = (status: string) => {
    return status === "Completed" ? "text-green-500" : "text-orange-500";
  };
  
  const isMobile = Mobileview.ismobileview; 
  
  return (
    <div className={`px-6 rounded-md m-5 grid ${isMobile ? "grid-cols-3" : "grid-cols-4"} items-center p-3 border ${
        isdark ? "bg-blue-900 border-blue-800" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex flex-col gap-1">
        <span className={`font-semibold ${completed ? 'line-through opacity-60' : ''}`}>
          {TaskName}
        </span>
        <span className={`font-medium text-blue-500 text-[15px] ${isMobile ? "hidden" : ""}`}>
          {Createdat}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className={`font-semibold text-[14px] ${
            isdark ? "text-white" : "text-gray-500"
        }`}>
          Project In
        </span>
        <span className="font-medium text-blue-500 text-[15px]">
          {ProjectName}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className={`font-semibold text-[14px] ${
            isdark ? "text-white" : "text-gray-500"
        }`}>
          Status
        </span>
        <span className={`font-medium text-[15px] ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function EmptyTasks(){
  return(
    <div className="p-1 gap-5 flex flex-col justify-between items-center">
      <div className="">
        <p className="text-gray-400 text-center text-[13px]">
          There are no tasks at the moment!
        </p>
      </div>
    </div>
  )
}