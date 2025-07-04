import {useGlobalContext} from "../contextAPI"
import DropDown from "../ProjectsScreen/DropDown"
import CategoriesArea from "./CategoriesArea"
import CategoriesTopBar from "./CategoriesTopBar"


export default function Categories(){
    const {isdark} = useGlobalContext()
    return(
        <div className={`w-full h-[1000px]  ${
                   isdark?"bg-gray-900":"bg-slate-50"
               }`}>
                   <DropDown/>
                   <CategoriesTopBar/>
                   <CategoriesArea/>
               </div>

    )
}