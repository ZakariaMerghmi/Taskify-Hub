"use client";
import useGlobalContext from "../contextAPI";
import AddProject from "./AddProjects";
import DropDown from "./DropDown";
import ProjectArea from "./ProjectArea";
import ProjectsTopBar from "./ProjectsTopBar";
import ProjectWindow from "./ProjectWindow";

export default function Projects() {
  const { isdark } = useGlobalContext();

  return (
    <div className={`relative w-full min-h-screen ${isdark ? "bg-gray-900" : "bg-slate-50"}`}>
      <ProjectsTopBar />
      <DropDown />
        <ProjectWindow />
      <AddProject />
      <ProjectArea />
    </div>
  );
}
