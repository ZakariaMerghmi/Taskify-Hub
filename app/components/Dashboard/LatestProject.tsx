import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGlobalContextProvider from "../contextAPI";
import { faBarsProgress, faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import ProjectNewIcon from "@/app/assets/svgs/svgicons";


export default function RightSidebar() {
    const { isdark } = useGlobalContextProvider();
    const Projects:any=[]
  return (
    <div className={`${isdark ? "bg-blue-950" : "bg-white"}
      p-4 flex gap-8 flex-col rounded-md py-8`}>
      <span className="font-semibold text-center text-lg">Latest Projects</span>
      <div>
        { Projects.length > 0 ?(
        <>
          <ProjectCard/>
        <ProjectCard/>
        <ProjectCard/>
        </>
        ):(
          <EmptyProjects/>)}
        
        
      </div>
    </div>
  );
}

function ProjectCard() {
    const { isdark } = useGlobalContextProvider();
  return (
    <div className={`w-full py-5 rounded-md p-4 text-sm flex flex-col gap-6 ${
        isdark ? "bg-blue-950" : "bg-white"
      }`}>
    <div className="flex items-center gap-2">
        <FontAwesomeIcon
        height={10}
        width={10}
        className="text-blue-500 p-2 rounded-full w-[12px] h-[12px]"
        icon={faDiagramProject}
        />
        <span>Project name</span>
        
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
            <span>9/12</span>
        </div>
        <div className="w-full h-[5px] rounded-2xl bg-gray-400 overflow-hidden">
            <div className="w-1/2 h-full bg-blue-500 rounded-r-lg"></div>
        </div>
    </div>
    </div>
  );
}


function EmptyProjects(){
  return(
    <div className="p-1 gap-5 flex flex-col justify-center items-center">
      <ProjectNewIcon width={120} height={120} color="#d4d4d4"  />
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
  )
}