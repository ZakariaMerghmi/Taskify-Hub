"use client";
import React, { useEffect, useState } from "react";
import { faBarsProgress, faDiagramProject, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useGlobalContext} from "../contextAPI";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../src/firebase"; // adjust the path
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
    const { isdark } = useGlobalContext();
    const [currentWidth, setCurrentWidth] = useState<number>(0);





    useEffect(() => {
        function handleResize() {
            setCurrentWidth(window.innerWidth);
        }
        
        setCurrentWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



      const [projects, setProjects] = useState<any[]>([]);

 const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
useEffect(() => {
    fetchProjects();
      
        const handleProjectDeleted = () => {
            fetchProjects();
        };
        window.addEventListener("projectDeleted", handleProjectDeleted);
        return () => {
            window.removeEventListener("projectDeleted", handleProjectDeleted);
        };
  }, []);

    return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 m-10`}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} setSelectedProject={setSelectedProject} />

      ))}
    </div>
  );
}


function ProjectCard({ project, setSelectedProject }: { project: any, setSelectedProject: (project: any) => void }) {
    const { isdark, DropDown, projectwindow } = useGlobalContext();
    const { setopenDropDown, setActiveItemId } = DropDown;
    const { setopenCreatedProjectBox } = projectwindow;
   

    const handleAction = (e: React.MouseEvent, action: 'dropdown' | 'open') => {
        e.stopPropagation();
        setActiveItemId(project.id); // 👈 now using project.id from Firebase
        if (action === 'dropdown') {
            setopenDropDown(true);
        } else {
            setSelectedProject(project); 
            setopenCreatedProjectBox(true);
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
    return (
        <div 
            className={`w-full py-5 rounded-md p-4 text-sm flex flex-col gap-6 relative border 
            cursor-pointer transition-all ${
                isdark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
            }`}
        >
            {/* Dots menu */}
            <div 
                onClick={(e) => handleAction(e, 'dropdown')}
                className={`absolute right-3 top-3 p-1 rounded-full w-6 h-6 flex items-center justify-center
                transition-colors three-dot-icon ${
                    isdark ? "hover:bg-slate-700" : "hover:bg-gray-200"
                }`}
                data-project-id={project.id}
            >
                <FontAwesomeIcon icon={faEllipsis} className="text-gray-500" />
            </div>

            {/* Project name */}
            <div className="flex items-center gap-2">
               <FontAwesomeIcon 
  icon={iconMap[project.icon] ?? faEllipsis} 
  className="text-blue-500 p-2 rounded-full text-xs"
/>


                <span 
                    onClick={(e) => handleAction(e, 'open')}
                    className={`${isdark ? "text-white" : "text-gray-900"} 
                    hover:text-blue-500 cursor-pointer`}
                >
                    {project.name ?? "Untitled Project"}
                </span>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-2">
                <div className={`flex justify-between items-center text-xs ${
                    isdark ? "text-white" : "text-gray-500"
                }`}>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faBarsProgress} />
                        <span>Progress</span>
                    </div>
                    <span>{progress.completed}/{progress.total}</span>
                </div>
                <div className={`w-full h-1 rounded-full overflow-hidden ${
                    isdark ? "bg-slate-600" : "bg-gray-200"
                }`}>
                    <div className="h-full bg-blue-500" style={{ width: `${percent}%` }}></div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 text-xs">
                {(project.categories ?? []).map((cat: string) => (
                    <div key={cat} className="bg-blue-500 px-2 py-1 rounded-md text-white">
                        {cat}
                    </div>
                ))}
            </div>
        </div>
    );
}
