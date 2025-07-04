import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {useGlobalContext} from "../contextAPI"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"

export default function CategoriesArea(){
    const {isdark , DropDown} =useGlobalContext();
     const {openDropDown, setopenDropDown} = DropDown
    return(
        <div className={`${isdark?"bg-gray-900":"bg-slate-50"} h-[870px]`}>
            <div className={`${isdark?"bg-gray-900":"bg-white"}
            rounded-md p-4 py-5 flex flex-col gap-4
            `}>
            <CategoryCard projectId="Category-1"/>
            <CategoryCard projectId="Category-2"/>
            <CategoryCard projectId="Category-3"/>
            </div>
           
        </div>
    )
}

function CategoryCard({projectId} : {projectId: string}){
    const {isdark , DropDown} =useGlobalContext();
     const {openDropDown, setopenDropDown , setActiveItemId} = DropDown;

     function handleDropDown(event : React.MouseEvent<HTMLDivElement>){
        event.stopPropagation();
        setActiveItemId(projectId);
        setopenDropDown(true)
     }

     function handleclose(){
        if(openDropDown){
            setopenDropDown(false)
        }
     }

    return(
        <div className={`${ isdark?"bg-blue-950":"bg-white"}
        p-4 flex px-5 rounded-md text-[14px]  justify-around gap-200 items-center`}
        onClick={handleclose}
        > 
        <div className="flex flex-col">
            <span className="font-semibold ">Category 1 </span>
            <span className="text-[12px] text-gray-400 "> Projects</span>
        </div>
        <div 
        onClick={handleDropDown}
        data-project-id={projectId}
        className="flex gap-5 hover:bg-gray-200 w-6 h-6 items-center justify-center rounded-full">
            <FontAwesomeIcon
            icon={faEllipsis}
            height={15}
            width={15}
            className="text-gray-500 cursor-pointer"
            />
        </div>
        </div>
    )
}