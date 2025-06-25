
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGlobalContextProvider from './contextAPI';
import React from 'react';


export default function Darkmode() {
    const {isdark , setisdark} = useGlobalContextProvider();
    return (
        <div className="">
           <div className={`${
            isdark ? "bg-blue-500" : "border bg-transparent"
           }
           rounded-3xl border-gray-300 h-[33px] w-[69px] flex relative`}>
            <div 
            onClick={() => setisdark(true)}
            className='bg-red-600 h-full w-1/2 opacity-0 '
            >
            </div>
            <div 
            onClick={() => setisdark(false)}
            className='bg-blue-500 h-full w-1/2 opacity-0 '>    
            </div>
            <div
            onClick={() => setisdark(!isdark)}
            className={`rounded-full h-[23px] w-[22px] top-[5px] ${
                isdark ? "bg-white translate-x-[34px]"
                       : "bg-slate-300 translate-x-[4px]"
            } w-[35px] absolute transition-all flex items-center justify-center`}>
                <FontAwesomeIcon
                className={`${isdark ? "text-blue-500" : "text-white"}`}
                height={12}
                width={12}
                icon={isdark ? faMoon : faSun}
                >

                </FontAwesomeIcon>
               

            </div>
            
           </div>
            
        </div>
    );}