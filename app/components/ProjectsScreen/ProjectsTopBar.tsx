"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../contextAPI";

export default function ProjectsTopBar() {
  const { isdark, Mobileview, Sidebar, projectwindow, projects } = useGlobalContext();
  const { OpenSidebar, setOpenSidebar } = Sidebar;
  const { ismobileview } = Mobileview;
  const { setopenNewProjectBox } = projectwindow;

  return (
    <div className={`p-8 pt-12 flex justify-between ${isdark ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex gap-7 items-center">
        <span className="flex flex-col">
          <span className="font-bold text-2xl">Projects</span>
          <p className="text-[12px] font-light">{projects.length} Projects</p>
        </span>
        <button
          onClick={() => setopenNewProjectBox(true)}
          className="bg-blue-500 flex gap-1 items-center p-2 px-4 text-white rounded-md cursor-pointer active:scale-95"
          aria-label="Add new project"
        >
          <FontAwesomeIcon icon={faPlus} className="font-bold" />
          <p>add new</p>
        </button>
      </div>

      {ismobileview && (
        <div className='flex md:hidden'>
          <FontAwesomeIcon
            onClick={() => setOpenSidebar(!OpenSidebar)}
            height={14}
            width={14}
            icon={faBars}
            className={`${isdark ? "text-white" : "text-gray-800"}`}
            role="button"
            tabIndex={0}
            aria-label="Toggle sidebar"
          />
        </div>
      )}
    </div>
  );
}