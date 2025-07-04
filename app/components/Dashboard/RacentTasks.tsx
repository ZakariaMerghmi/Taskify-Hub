"use client";
import {useGlobalContext} from "../contextAPI";
import { useEffect, useState } from "react";


interface RecentTask {
  id: number;
  TaskName: string;
  Createdat: string;
  ProjectName: string;
  status: string;
}

export default function RecentTasks() {
  const [currentWidth, setCurrentWidth] = useState<number>(0); 
  

  useEffect(() => {
    
    setCurrentWidth(window.innerWidth);
    
    function handleWidth(){
      setCurrentWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleWidth);
    return () => {
      window.removeEventListener("resize", handleWidth);
    }
  }, []);

  const recentTaskArray: RecentTask[] = [
   // {
    //  id: 1,
    //  TaskName: "Coding",
   //   Createdat: "30 April 2024",
   //   ProjectName: "Project 1",
    //  status: "Pending"
    //},
    //{
    //  id: 2,
     // TaskName: "Designing",
    //  Createdat: "30 April 2024", 
     // ProjectName: "Project 3",
    //  status: "Completed"
  //  },
  //  {
   //   id: 3,
      //TaskName: "Testing",
     // Createdat: "30 April 2024",
    //  ProjectName: "Project 2",
   //   status: "Pending"
   // }
  ];
  
  const {isdark} = useGlobalContext();

  
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
              <span className="font-semibold">{task.TaskName}</span>
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
    })) :(
            <EmptyTasks/>
        )} 
    </div>
  );
}

function Task({recentTaskprop, currentWidth}: {recentTaskprop: RecentTask, currentWidth: number}) {
  const {TaskName, Createdat, ProjectName, status} = recentTaskprop;
  const {isdark , Mobileview} = useGlobalContext();
  
  const getStatusColor = (status: string) => {
    return status === "Completed" ? "text-green-500" : "text-orange-500";
  };
  
  const isMobile = Mobileview.ismobileview; 
  
  return (
    <div className={`px-6 rounded-md m-5 grid ${isMobile ? "grid-cols-3" : "grid-cols-4"} items-center p-3 border ${
        isdark ? "bg-blue-900 border-blue-800" : "bg-gray-50 border-gray-200"
    }`}>
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{TaskName}</span>
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
                    there are no Task in the moment!
                </p>
            </div>
        </div>
    )
}