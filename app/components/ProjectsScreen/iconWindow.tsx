import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import useGlobalContextProvider from "../contextAPI";
import { icondata } from "../../../iconsData";





export default function IconWindow(){
    const [allIcons , setAllIcons] = useState(icondata);
    const {iconBox , isdark} = useGlobalContextProvider();
    const {openIconBox , setOpenIconBox}=iconBox;
    useEffect(()=>{
        setAllIcons(icondata)
    },[openIconBox])
    return(
        <div className={`w-full left-0 flex absolute justify-center items-center top-0 ${
            openIconBox?"flex":"hidden"
        }`}>
            <div className={`relative z-50 w-[400px] p-4 rounded-md border flex flex-col
                gap-6 shadow-md ${isdark?"bg-blue-950":"bg-white text-black"}`}>
                <FontAwesomeIcon
                height={20}
                width={20}
                className={`${isdark?"bg-blue-950":"bg-white"} absolute top-4 right-4
                text-gray-300 cursor-pointer hover:text-gray-500 transition-colors`}
                icon={faClose}
                onClick={()=>setOpenIconBox(false)}
                />
                <span className="font-bold text-lg bg-transparent mt-3">
                    choose your Icon
                </span>
                <div className="border border-gray-200 p-5 flex flex-wrap gap-4 items-center
                rounded-md ">
                    {allIcons.map((icon , index)=>(
                        <FontAwesomeIcon
                        key={index}
                        icon={icon.faIcon}
                        className={`border p-2 rounded-md text-xl cursor-pointer transition-all duration-200
                            ${icon.isSelected 
                                ? "border-blue-500 text-blue-500 bg-blue-50" 
                                : `border-gray-300 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 ${
                                    isdark ? "text-white hover:bg-blue-900" : "text-black"
                                  }`
                            }`}
                        height={50}
                        width={50}
                        onClick={() => {
                            const updatedIcons = allIcons.map((item, i) => ({
                                ...item,
                                isSelected: i === index
                            }));
                            setAllIcons(updatedIcons);
                        }}
                        />
                    ))}
                </div>
                <div className="flex my-2 justify-end">
                    <button className="bg-blue-500 select-none p-2 rounded-md text-white 
                    text-[13px] px-8 hover:bg-blue-600 transition-colors hover:cursor-pointer active:scale-95">
                        save
                    </button>
                </div>
            </div>
        </div>
    )
}