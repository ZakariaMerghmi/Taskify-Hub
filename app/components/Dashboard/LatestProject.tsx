import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../contextAPI";
import { faBarsProgress, faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import ProjectNewIcon from "@/app/assets/svgs/svgicons";
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
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// Define the project type based on your existing structure
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
  [key: string]: any; // For any additional properties
}

export default function RightSidebar() {
  const { isdark } = useGlobalContext();
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      // Get the latest 3 projects
      const latestProjects = data.slice(-3).reverse();
      setProjects(latestProjects);
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
    <div className={`${isdark ? "bg-blue-950" : "bg-white"}
      p-4 flex gap-8 flex-col rounded-md py-8`}>
      <span className="font-semibold text-center text-lg">Latest Projects</span>
      <div>
        {projects.length > 0 ? (
          <>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </>
        ) : (
          <EmptyProjects />
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { isdark } = useGlobalContext();
  
  const iconMap: Record<string, IconDefinition> = {
    star: faStar,
    coffee: faCoffee,
    bolt: faBolt,
    heart: faHeart,
    book: faBook,
    rocket: faRocket,
    smile: faSmile,
  };

  const progress = project.progress ?? { completed: 0, total: 1 };
  const percent = Math.floor((progress.completed / progress.total) * 100);

  return (
    <div className={`w-full py-5 rounded-md p-4 text-sm flex flex-col gap-6 mb-4 ${
        isdark ? "bg-blue-950" : "bg-white"
      }`}>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon
          height={10}
          width={10}
          className="text-blue-500 p-2 rounded-full w-[12px] h-[12px]"
          icon={project.icon && iconMap[project.icon] ? iconMap[project.icon] : faDiagramProject}
        />
        <span>{project.name ?? "Untitled Project"}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div
          className={`flex justify-between items-center text-[12px] ${
            isdark ? "text-white" : "text-gray-500"
          }`}
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              height={12}
              width={12}
              icon={faBarsProgress}
            />
            <span>Progress</span>
          </div>
          <span>{progress.completed}/{progress.total}</span>
        </div>
        <div className="w-full h-[5px] rounded-2xl bg-gray-400 overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-r-lg transition-all duration-300" 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function EmptyProjects() {
  return (
    <div className="p-1 gap-5 flex flex-col justify-center items-center">
      <ProjectNewIcon width={120} height={120} color="#d4d4d4" />
      <div>
        <h3 className="font-semibold text-lg mb-1 text-center">{`there are no projects yet...`}</h3>
        <p className="text-gray-400 text-sm w-52 text-center">
          please click below to add a new project
        </p>
      </div>
      <button className="bg-blue-500 p-3 rounded-md text-white text-center text-sm px-7 hover:cursor-pointer active:scale-95">
        Add new Project
      </button>
    </div>
  );
}