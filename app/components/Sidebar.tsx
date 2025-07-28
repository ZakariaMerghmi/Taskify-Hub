'use client';
import React, { useEffect, useRef } from 'react'
import { faArrowRightFromBracket, faBarsProgress, faDashboard, faFeather, faLayerGroup, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import Darkmode from './Darkmode';
import {useGlobalContext} from './contextAPI';
import { getIconByName } from './contextAPI';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    
    const updateselectedItem = (index: number) => {
        const updatedItems = menuItems.map((item, i) => ({
            ...item,
            isSelected: i === index ? true : false
        }));
        setMenuItems(updatedItems);
    }
    
    const {Sidebar, isdark, DashboardItems , Auth } = useGlobalContext();
    const { user, logout } = Auth;
    const {OpenSidebar, setOpenSidebar} = Sidebar;
    const SideBarRef = useRef<HTMLDivElement>(null);
    const {menuItems, setMenuItems} = DashboardItems;
    
    const handleSignOut = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            router.push('/authentication'); 
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };
    
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
                    <span className='text-blue-500 font-bold'>Focusly</span> 
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
                           icon={getIconByName(item.icon) || faQuestionCircle}
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
                    {user ? (
                        <div className='flex flex-col gap-4'>
                            
                            <div className='flex items-center gap-3 text-sm'>
                                <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className='text-white text-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-blue-500 font-medium'>
                                        {user.displayName || 'User'}
                                    </span>
                                    <span className='text-gray-500 text-xs'>
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                            
                       
                            <button
                                onClick={handleSignOut}
                                disabled={isLoggingOut}
                                className='flex items-center gap-3 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                <FontAwesomeIcon
                                    height={20}
                                    width={20}
                                    icon={faArrowRightFromBracket}
                                />
                                <span className='text-[15px]'>
                                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                                </span>
                            </button>
                        </div>
                    ) : (
                        <Link 
                            href="/authentication"
                            className='flex items-center gap-3 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                        >
                            <FontAwesomeIcon
                                height={20}
                                width={20}
                                icon={faArrowRightFromBracket}
                            />
                            <span className='text-[15px]'>Sign in/up</span>
                        </Link>
                    )}
                </div>
                <Darkmode />
            </div>
        </div>
    )
}

export default Sidebar