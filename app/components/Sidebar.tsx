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
            poppins z-50 shadow-xl fixed md:sticky top-0 left-0 h-screen w-[280px] p-6 pt-12 md:flex flex-col gap-8
            ${isdark ? "bg-slate-900 border-r border-slate-800" : "bg-white border-r border-gray-100"} transition-all duration-300`}
        >
            <div className='flex gap-3 items-center select-none'>
                <div className='relative'>
                    <FontAwesomeIcon
                        icon={faFeather}
                        className='text-white text-xl font-bold bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg' />
                    <div className='absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl blur-sm opacity-30 -z-10'></div>
                </div>
                <span className='text-2xl font-light select-none'>
                    <span className={`font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent ${isdark ? 'from-white to-gray-300' : ''}`}>Foxly</span> 
                </span>
            </div>
            
            <div className='flex-1 flex flex-col gap-4 overflow-y-auto'>
                <div className='text-[15px] flex flex-col gap-3 select-none'>
                   {menuItems.map((item, index) => 
                      <div
                        key={index}
                        className={`group flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md
                          ${item.isSelected 
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' 
                            : `${isdark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'} hover:border-l-4 hover:border-orange-500`
                          }`}
                        onClick={() => updateselectedItem(index)}
                      >
                        <FontAwesomeIcon 
                          className={`text-lg transition-all duration-300 ${
                            item.isSelected 
                              ? 'text-white transform scale-110' 
                              : `${isdark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-orange-500 group-hover:transform group-hover:scale-110`
                          }`}
                           icon={getIconByName(item.icon) || faQuestionCircle}
                          width={20}
                          height={20}
                        />
                        <span className='text-[15px] font-medium'>{item.name}</span>
                        {item.isSelected && (
                          <div className='ml-auto w-2 h-2 bg-white rounded-full animate-pulse'></div>
                        )}
                      </div>
                    )}
                </div>
            </div>
            
            <div className='pb-8 mt-auto'>
                <div className='pl-5 cursor-pointer p-3 flex flex-col gap-8'>
                    {user ? (
                        <div className='flex flex-col gap-4'>
                            
                            <div className='flex items-center gap-3 text-sm group cursor-pointer'>
                                <div className='relative'>
                                    <div className={`w-10 h-10 ${isdark ? 'bg-slate-700' : 'bg-slate-100'} rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 group-hover:shadow-lg group-hover:shadow-orange-500/25`}>
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className={`text-sm transition-all duration-300 ${isdark ? 'text-slate-300' : 'text-slate-600'} group-hover:text-white group-hover:scale-110`}
                                        />
                                    </div>
                                    <div className='absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm'></div>
                                </div>
                                <div className='flex flex-col'>
                                    <span className={`font-medium transition-colors duration-300 ${isdark ? 'text-slate-200' : 'text-slate-700'} group-hover:text-orange-500`}>
                                        {user.displayName || 'User'}
                                    </span>
                                    <span className={`text-xs ${isdark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                            
                       
                            <button
                                onClick={handleSignOut}
                                disabled={isLoggingOut}
                                className={`group flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-red-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${isdark ? 'hover:bg-red-900/20' : ''}`}
                            >
                                <FontAwesomeIcon
                                    height={20}
                                    width={20}
                                    icon={faArrowRightFromBracket}
                                    className={`transition-all duration-300 ${isdark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-red-500 group-hover:transform group-hover:scale-110`}
                                />
                                <span className={`text-[15px] font-medium transition-colors duration-300 ${isdark ? 'text-slate-300' : 'text-slate-600'} group-hover:text-red-500`}>
                                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                                </span>
                            </button>
                        </div>
                    ) : (
                        <Link 
                            href="/authentication"
                            className={`group flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-orange-50 hover:shadow-md ${isdark ? 'hover:bg-orange-900/20' : ''}`}
                        >
                            <FontAwesomeIcon
                                height={20}
                                width={20}
                                icon={faArrowRightFromBracket}
                                className={`transition-all duration-300 ${isdark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-orange-500 group-hover:transform group-hover:scale-110`}
                            />
                            <span className={`text-[15px] font-medium transition-colors duration-300 ${isdark ? 'text-slate-300' : 'text-slate-600'} group-hover:text-orange-500`}>Sign in/up</span>
                        </Link>
                    )}
                </div>
                <Darkmode />
            </div>
        </div>
    )
}

export default Sidebar