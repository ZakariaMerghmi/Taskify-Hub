"use client";
import { useGlobalContext } from "../contextAPI";
import AddProject from "./AddProjects";
import DropDown from "./DropDown";
import ProjectArea from "./ProjectArea";
import ProjectsTopBar from "./ProjectsTopBar";
import ProjectWindow from "./ProjectWindow";
import { useState } from "react";

export default function Projects() {
  const { isdark, projectwindow } = useGlobalContext();
  const { openNewProjectBox, setopenNewProjectBox } = projectwindow;
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const handleAdd = () => {
    setRefreshKey(prev => prev + 1); 
    setopenNewProjectBox(false);
  };

  return (
    <div className={`relative w-full min-h-screen ${isdark ? "bg-gray-900" : "bg-slate-50"}`}>
      <ProjectsTopBar />
      <DropDown />
      {/* Fixed: Changed 'project' to 'selectedProject' to match the expected prop name */}
      <ProjectWindow selectedProject={selectedProject}/>
      {openNewProjectBox && <AddProject onAdd={handleAdd} />}
      <ProjectArea key={refreshKey} onAdd={handleAdd} setSelectedProject={setSelectedProject}/>
    </div>
  );
}