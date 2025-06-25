import useGlobalContextProvider from "../contextAPI"
import DropDown from "../ProjectsScreen/DropDown"
import CategoriesArea from "./CategoriesArea"
import CategoriesTopBar from "./CategoriesTopBar"


export default function Categories(){
    const {isdark} = useGlobalContextProvider()
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