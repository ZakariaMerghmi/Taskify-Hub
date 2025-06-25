'use client';
import React, { useEffect, useRef } from 'react'
import { faArrowRightFromBracket, faBarsProgress, faDashboard, faFeather, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import Darkmode from './Darkmode';
import useGlobalContextProvider from './contextAPI';

const Sidebar = () => {
    const updateselectedItem = (index: number) => {
        const updatedItems = menuItems.map((item, i) => ({
            ...item,
            isSelected: i === index ? true : false
        }));
        setMenuItems(updatedItems);
    }
    
    const {Sidebar, isdark, DashboardItems} = useGlobalContextProvider();
    const {OpenSidebar, setOpenSidebar} = Sidebar;
    const SideBarRef = useRef<HTMLDivElement>(null);
    const {menuItems, setMenuItems} = DashboardItems;
    
    useEffect(() => {
        if (!OpenSidebar) return;

        function handleClickOutside(event: MouseEvent) {
            if (SideBarRef.current && !SideBarRef.current.contains(event.target as Node)) {
                setOpenSidebar(false);
            }
        }

        const timer = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [OpenSidebar]);

    return (
        <div 
            ref={SideBarRef}
            className={`${OpenSidebar ? "flex" : "hidden"} 
            poppins z-50 shadow-lg fixed md:sticky top-0 left-0 h-screen w-[280px] p-6 pt-12 md:flex flex-col gap-8
            ${isdark ? "bg-blue-950" : "bg-white"} transition-all duration-300`}
        >
            <div className='flex gap-2 items-center select-none'>
                <FontAwesomeIcon
                    icon={faFeather}
                    className='text-white text-xl font-bold bg-blue-500 p-2 rounded-sm' />
                <span className='text-2xl font-light select-none'>
                    <span className='text-blue-500 font-bold'>Taskify</span> Hub
                </span>
            </div>
            
            <div className='flex-1 flex flex-col gap-4 overflow-y-auto'>
                <div className='text-[15px] flex flex-col gap-3 select-none'>
                    {menuItems.map((item, index) => 
                        <div 
                            key={index}
                            className={`flex items-center gap-3 cursor-pointer p-3 rounded-md transition-colors
                            ${item.isSelected ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100 hover:dark:bg-blue-900'}`}
                            onClick={() => updateselectedItem(index)}
                        >
                            <FontAwesomeIcon 
                                className={`text-lg ${item.isSelected ? 'text-white' : 'text-blue-500'}`}
                                icon={item.icon}
                                width={20}
                                height={20}
                            />
                            <span className='text-[15px]'>{item.name}</span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className='pb-8 mt-auto'>
                <div className='pl-5 cursor-pointer p-3 flex flex-col gap-8'>
                    <div className='flex items-center gap-3 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400'>
                        <FontAwesomeIcon
                            height={20}
                            width={20}
                            icon={faArrowRightFromBracket}
                        />
                        <span className='text-[15px]'>Logout</span>
                    </div>
                </div>
                <Darkmode />
            </div>
        </div>
    )
}

export default Sidebar