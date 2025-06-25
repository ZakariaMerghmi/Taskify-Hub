import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGlobalContextProvider from "../contextAPI";
import { faClose, faPodcast } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import IconWindow from "./iconWindow";

export default function AddProject() {
    const { isdark, projectwindow , iconBox } = useGlobalContextProvider();
    
    const {openIconBox , setOpenIconBox} = iconBox
    const [dimensions, setDimensions] = useState({ 
        width: Math.min(590, window.innerWidth - 40), // Responsive width
        height: 400 
    });
    
    const { openNewProjectBox, setopenNewProjectBox } = projectwindow;

    // Handle responsive sizing and centering
    useEffect(() => {
        const updateDimensions = () => {
            const newWidth = Math.min(590, window.innerWidth - 40);
            setDimensions({
                width: newWidth,
                height: Math.min(400, window.innerHeight - 40)
            });
        };

        if (openNewProjectBox) {
            updateDimensions();
            window.addEventListener('resize', updateDimensions);
        }

        return () => window.removeEventListener('resize', updateDimensions);
    }, [openNewProjectBox]);

    return (
        <>
          
            <div className={` select-none
                fixed inset-0 bg-black z-30 transition-opacity duration-300
                ${openNewProjectBox ? "opacity-50" : "opacity-0 pointer-events-none"}
            `} onClick={() => setopenNewProjectBox(false)
                
            }
             />
            
          
            <div 
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                }}
                className={`
                    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    p-6 py-7 rounded-lg flex flex-col z-40 shadow-md
                    transition-all duration-300 origin-center
                    ${isdark ? "bg-blue-950" : "bg-white"}
                    ${openNewProjectBox ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
                `}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                
                <IconWindow />
                
                <div className="flex justify-between items-center">
                    <h2 id="modal-title" className="font-semibold text-[20px] mt-1">
                        Add New Project
                    </h2>
                    <button 
                        onClick={() => setopenNewProjectBox(false)}
                        aria-label="Close modal"
                        className="opacity-30 hover:opacity-100 transition-opacity"
                    >
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </div>

                <form className="flex flex-col gap-6 mt-6 flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-2 px-3">
                        <label htmlFor="project-name" className="text-sm opacity-80">
                            Project Name
                        </label>
                        <div className="flex gap-4 justify-between items-center">
                            <input
                                id="project-name"
                                type="text"
                                className={`
                                    border w-full border-gray-200 outline-none p-3
                                    rounded-md text-[12px] ${isdark ? "bg-blue-950" : "bg-white"}
                                `}
                                placeholder="Type a name for your project"
                            />
                            <FontAwesomeIcon 
                                icon={faPodcast} 
                                className="cursor-pointer  hover:text-blue-500 transition-colors"
                                onClick={() => setOpenIconBox(true)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mx-3">
                        <label htmlFor="project-category" className="text-sm opacity-80">
                            Categories
                        </label>
                        <select 
                            id="project-category"
                            className={`
                                p-3 text-[13px] outline-none border border-gray-200
                                rounded-md ${isdark ? "bg-blue-950" : "bg-white opacity-60"}
                            `}
                        >
                            <option value="">Select a Category...</option>
                            <option value="option2">Category 1</option>
                            <option value="option3">Category 2</option>
                        </select>
                    </div>

                    <div className="text-center mx-2 mt-auto">
                        <button 
                            type="submit"
                            className="bg-blue-500 w-full p-3 text-white rounded-md text-sm
                            hover:bg-blue-600 transition-colors"
                        >
                            Add a Project
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}