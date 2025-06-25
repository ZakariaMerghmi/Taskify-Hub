"use client";
import React, { useEffect, useState } from "react";
import { faBarsProgress, faDiagramProject, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGlobalContextProvider from "../contextAPI";



export default function ProjectArea() {
    const { isdark } = useGlobalContextProvider();
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
        <div className={`${isdark ? "bg-gray-900" : "bg-white"} p-8 min-h-[870px]`}>
            <div className={`${isdark ? "bg-blue-950" : "bg-white"} 
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 rounded-md`}>
                {[1, 2, 3].map((id) => (
                    <ProjectCard key={`project-${id}`} projectId={`project-${id}`} />
                ))}
            </div>
        
        </div>
    );
}

// ProjectCard Component
function ProjectCard({ projectId }: { projectId: string }) {
    const { isdark, DropDown, projectwindow } = useGlobalContextProvider();
    const { setopenDropDown, setActiveItemId } = DropDown;
    const { setopenCreatedProjectBox } = projectwindow;

    const handleAction = (e: React.MouseEvent, action: 'dropdown' | 'open') => {
        e.stopPropagation();
        setActiveItemId(projectId);
        if (action === 'dropdown') {
            setopenDropDown(true);
        } else {
            setopenCreatedProjectBox(true);
        }
    };

    return (
        <div 
            className={`w-full py-5 rounded-md p-4 text-sm flex flex-col gap-6 relative border 
            cursor-pointer transition-all ${
                isdark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
            }`}
        >
           
            <div 
                onClick={(e) => handleAction(e, 'dropdown')}
                className={`absolute right-3 top-3 p-1 rounded-full w-6 h-6 flex items-center justify-center
                transition-colors three-dot-icon ${
                    isdark ? "hover:bg-slate-700" : "hover:bg-gray-200"
                }`}
                data-project-id={projectId}
            >
                <FontAwesomeIcon icon={faEllipsis} className="text-gray-500" />
            </div>
            
            
            <div className="flex items-center gap-2">
                <FontAwesomeIcon 
                    icon={faDiagramProject} 
                    className="text-blue-500 p-2 rounded-full text-xs"
                />
                <span 
                    onClick={(e) => handleAction(e, 'open')}
                    className={`${isdark ? "text-white" : "text-gray-900"} 
                    hover:text-blue-500 cursor-pointer`}
                >
                    {projectId}
                </span>
            </div>
            
           
            <div className="flex flex-col gap-2">
                <div className={`flex justify-between items-center text-xs ${
                    isdark ? "text-white" : "text-gray-500"
                }`}>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faBarsProgress} />
                        <span>Progress</span>
                    </div>
                    <span>9/12</span>
                </div>
                <div className={`w-full h-1 rounded-full overflow-hidden ${
                    isdark ? "bg-slate-600" : "bg-gray-200"
                }`}>
                    <div className="w-3/4 h-full bg-blue-500"></div>
                </div>
            </div>
            
           
            <div className="flex flex-wrap gap-2 text-xs">
                {['Category 1', 'Category 2'].map((cat) => (
                    <div key={cat} className="bg-blue-500 px-2 py-1 rounded-md text-white">
                        {cat}
                    </div>
                ))}
            </div>
        </div>
    );
}