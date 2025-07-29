'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../contextAPI";

export default function ProjectsTopBar() {
  const { isdark, Mobileview, Sidebar, projectwindow, projects } = useGlobalContext();
  const { OpenSidebar, setOpenSidebar } = Sidebar;
  const { ismobileview } = Mobileview;
  const { setopenNewProjectBox } = projectwindow;

  return (
    <div className={`p-8 pt-12 flex justify-between ${isdark ? "bg-slate-900" : "bg-white"} transition-all duration-300`}>
      <div className="flex gap-7 items-center">
        <span className="flex flex-col">
          <span className={`font-bold text-2xl bg-gradient-to-r ${isdark ? 'from-white to-gray-300' : 'from-slate-700 to-slate-900'} bg-clip-text text-transparent`}>
            Projects
          </span>
          <p className={`text-[12px] font-light ${isdark ? 'text-slate-400' : 'text-slate-500'}`}>
            {projects.length} Projects
          </p>
        </span>
        
        <button
          onClick={() => setopenNewProjectBox(true)}
          className="group relative bg-gradient-to-r from-orange-500 to-orange-600 flex gap-2 items-center p-3 px-5 text-white rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 font-medium"
          aria-label="Add new project"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl blur-sm opacity-30 -z-10 group-hover:opacity-40 transition-opacity duration-300"></div>
          <FontAwesomeIcon 
            icon={faPlus} 
            className="text-sm transition-all duration-300 group-hover:scale-110" 
          />
          <span className="text-[15px]">Add New</span>
        </button>
      </div>

      {ismobileview && (
        <div className='flex md:hidden'>
          <button
            onClick={() => setOpenSidebar(!OpenSidebar)}
            className={`group p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
              isdark 
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon
              height={16}
              width={16}
              icon={faBars}
              className={`transition-all duration-300 group-hover:text-orange-500 group-hover:scale-110`}
            />
          </button>
        </div>
      )}
    </div>
  );
}