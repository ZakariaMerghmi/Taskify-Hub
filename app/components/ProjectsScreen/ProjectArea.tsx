"use client";
import React, { useEffect, useState } from "react";
import { faBarsProgress, faDiagramProject, faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../contextAPI";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../src/firebase"; 
import {
  faStar,
  faCoffee,
  faBolt,
  faHeart,
  faBook,
  faRocket,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ProjectAreaProps = {
  onAdd: () => void;
  setSelectedProject: (project: any) => void;
};

export default function ProjectArea({ onAdd, setSelectedProject }: ProjectAreaProps) {
  const { isdark, projects, Auth } = useGlobalContext();
  const { isDemoMode } = Auth;
  const [currentWidth, setCurrentWidth] = useState<number>(0);

  useEffect(() => {
    function handleResize() {
      setCurrentWidth(window.innerWidth);
    }
    
    setCurrentWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`${isdark ? "bg-gray-900" : "bg-slate-50"} h-[870px] p-4`}>
      {projects.length === 0 ? (
        <div
          className={`text-center italic text-sm mt-10 ${
            isdark ? "text-slate-50" : "text-gray-600"
          }`}
        >
          No projects yet. Click "Add New" to create one.
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              setSelectedProject={setSelectedProject}
              isDemoMode={isDemoMode()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ 
  project, 
  setSelectedProject, 
  isDemoMode 
}: { 
  project: any, 
  setSelectedProject: (project: any) => void,
  isDemoMode: boolean 
}) {
  const { isdark, DropDown, projectwindow, projects, Auth, setProjects } = useGlobalContext();
  const { setopenDropDown, setActiveItemId, setDeleteFunction } = DropDown;
  const { setopenCreatedProjectBox } = projectwindow;
   
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await handleDelete();
  };

  const handleAction = (e: React.MouseEvent, action: 'open') => {
    e.stopPropagation();
    if (action === 'open') {
      setSelectedProject(project); 
      setopenCreatedProjectBox(true);
    }
  };

  const handleDelete = async () => {
    try {
      if (isDemoMode) {
   
        console.log('🎭 Demo mode - removing project from localStorage');
        
       
        const updatedProjects = projects.filter((p: any) => p.id !== project.id);
        setProjects(updatedProjects);
        
        const currentDemoData = localStorage.getItem('foxly_demo_data');
        if (currentDemoData) {
          const parsedDemoData = JSON.parse(currentDemoData);
          const updatedDemoData = {
            ...parsedDemoData,
            projects: updatedProjects
          };
          localStorage.setItem('foxly_demo_data', JSON.stringify(updatedDemoData));
        }
        
        console.log('✅ Demo project deleted successfully');
      } else {
        
        console.log('🔥 Firebase mode - deleting project from Firestore');
        await deleteDoc(doc(db, "projects", project.id));
        
     
        const updatedProjects = projects.filter((p: any) => p.id !== project.id);
        setProjects(updatedProjects);
        
        console.log('✅ Firebase project deleted successfully');
      }
    } catch (error) {
      console.error("❌ Failed to delete project:", error);
   
    }
  };

  const progress = project.progress ?? { completed: 0, total: 1 };
  const percent = Math.floor((progress.completed / progress.total) * 100);

  const iconMap: Record<string, IconDefinition> = {
    star: faStar,
    coffee: faCoffee,
    bolt: faBolt,
    heart: faHeart,
    book: faBook,
    rocket: faRocket,
    smile: faSmile,
  };

  
  const getCategories = () => {
    if (project.category) {
      
      return [project.category];
    }
    if (project.categories && Array.isArray(project.categories)) {
    
      return project.categories;
    }
    return [];
  };

  const categories = getCategories();

  return (
    <div 
      className={`w-full py-5 rounded-md p-4 text-sm flex flex-col gap-4 relative border 
      cursor-pointer transition-all hover:shadow-lg ${
        isdark ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >

  
      <div className="flex items-center gap-2">
        <FontAwesomeIcon 
          icon={iconMap[project.icon] ?? faEllipsis} 
          className="text-blue-500 p-2 rounded-full text-xs"
        />
        <span 
          onClick={(e) => handleAction(e, 'open')}
          className={`font-medium ${isdark ? "text-white" : "text-gray-900"} 
          hover:text-blue-500 cursor-pointer transition-colors`}
        >
          {project.name ?? "Untitled Project"}
        </span>
      </div>

      
      {isDemoMode && (
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isdark 
              ? "bg-yellow-900 text-yellow-200 border border-yellow-700" 
              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
          }`}>
            Demo
          </span>
        </div>
      )}

  
      {categories.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: string, index: number) => (
              <div 
                key={index} 
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isdark 
                    ? "bg-blue-900 text-blue-200 border border-blue-700" 
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      )}

   
      {categories.length === 0 && (
        <div className="flex flex-col gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block w-fit ${
            isdark 
              ? "bg-gray-700 text-gray-400 border border-gray-600" 
              : "bg-gray-100 text-gray-500 border border-gray-300"
          }`}>
            No Category
          </div>
        </div>
      )}

     
      <div className="flex flex-col gap-2">
        <div className={`flex justify-between items-center text-xs ${
          isdark ? "text-white" : "text-gray-500"
        }`}>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBarsProgress} />
            <span>Progress</span>
          </div>
          <span className="font-medium">{progress.completed}/{progress.total}</span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${
          isdark ? "bg-slate-600" : "bg-gray-200"
        }`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300" 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <div className={`text-xs text-right ${
          isdark ? "text-gray-400" : "text-gray-500"
        }`}>
          {percent}% complete
        </div>
      </div>

      
      <button
        onClick={handleDeleteClick}
        className={`mt-2 p-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2
        hover:scale-105 active:scale-95 ${
          isdark 
            ? "bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-800 hover:border-red-600" 
            : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300"
        }`}
      >
        <FontAwesomeIcon icon={faTrash} className="text-sm" />
        <span className="text-sm font-medium">Delete Project</span>
      </button>
    </div>
  );
}


export { ProjectCard };