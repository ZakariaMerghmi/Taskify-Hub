"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars } from "@fortawesome/free-solid-svg-icons";
import {useGlobalContext} from "../contextAPI";
import { useState } from "react";

export default function ProjectsTopBar() {
  const { isdark, Mobileview, Sidebar, projectwindow } = useGlobalContext();
  const { OpenSidebar, setOpenSidebar } = Sidebar;
  const { ismobileview } = Mobileview;
  const { setopenNewProjectBox } = projectwindow;
  



  
  return (
    <div className={`flex justify-between items-center p-4 ${
      isdark ? "bg-blue-950" : "bg-white"
    }`}>
      <div className="flex items-center gap-4">
        {ismobileview && (
          <button onClick={() => setOpenSidebar(!OpenSidebar)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
        <h1 className="text-xl font-bold">Projects</h1>
      </div>
      
      <button
        onClick={() => setopenNewProjectBox(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          isdark ? "bg-blue-800 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <FontAwesomeIcon icon={faPlus} />
        Add Project
      </button>
    </div>
  );
}