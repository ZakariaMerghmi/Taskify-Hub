import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGlobalContextProvider from "./contextAPI";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef } from "react";


export default function SearchBar() {
    const { isdark } = useGlobalContextProvider();
    const inputRef =useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
  return (
    <div className='w-1/3 flex gap-2 items-center border p-3 rounded-md'>
     <FontAwesomeIcon
     height={20}
     width={20}
     className={`cursor-pointer ${isdark ? "text-white" : "text-gray-500"}`}
     icon={faSearch}
     
     />
     <input
     className={`outline-none text-[14px] font-light w-full ${
        isdark ? "text-white bg-transparent" : " text-gray-800"
     }`}
        placeholder="Search..."
        ref={inputRef} />
    </div>
  );
}