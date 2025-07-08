import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import {useGlobalContext} from '../contextAPI';
import { faAngleDown, faBars, faClose, faDoorOpen, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SearchBar from '../SearchBar';
import Statistics from './Statistics';
import RightSidebar from './RightSidebar';
import CharBar from './CharBar';
import RecentTasks from './RacentTasks';

const Dashboard = () => {
    const {isdark, Mobileview, Sidebar} = useGlobalContext();
    const {ismobileview} = Mobileview;
    const {OpenSidebar} = Sidebar;

    return (
        <div className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 
             ${OpenSidebar ? "md:ml-[280px] md:w-[calc(100%-280px)]" : ""}`}>
            <TopBar/>
            <div 
                className={`${isdark ? "bg-transparent" : "bg-slate-50"}
                ${ismobileview ? "flex-col" : "flex-row"} flex`}
            >
                <div className={`${ismobileview ? "w-full" : "w-full lg:w-8/12"} border-r ${isdark ? "border-gray-700" : "border-gray-200"}`}>
                    <div className={`${ismobileview ? "p-4" : "p-8"} space-y-8 w-full`}>
                        <div className="space-y-8 w-full">
                            <Statistics/>
                            <CharBar/>
                            <RecentTasks/>
                        </div>
                    </div>
                </div>
                <RightSidebar/> {/* Moved inside the flex container */}
            </div>
        </div>
    )
}

export default Dashboard;

function TopBar() {
    const [searchBar, setSearchBar] = React.useState(false);
    const [showLogoutTooltip, setShowLogoutTooltip] = React.useState(false);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);
    const {isdark , Sidebar, Auth} = useGlobalContext();
    const {OpenSidebar , setOpenSidebar} = Sidebar;
    const {user, logout} = Auth; // Make sure to get the logout function from Auth
    
    // Extract the first name from the user's display name or email
    const getFirstName = () => {
        if (user?.displayName) {
            return user.displayName.split(' ')[0];
        }
        if (user?.email) {
            return user.email.split('@')[0];
        }
        return 'User';
    };
    
    const firstName = getFirstName();
    
    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout(); 
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };
    return (
        <div className='p-4 md:p-8 md:pt-12 flex items-center justify-between w-full'>
            <div className='flex md:hidden'>
                <FontAwesomeIcon
                    onClick={() => setOpenSidebar(!OpenSidebar)}
                    height={14}
                    width={14}
                    icon={faBars}
                    className={`${isdark ? "text-white" : "text-gray-800"}`}
                />
            </div>
            <div className='flex flex-col'>
                <span className='font-bold text-xl md:text-2xl'>
                    Hello, <span className='font-light'>{firstName}</span>
                </span>
                <span className='text-[12px] font-light'>
                    Welcome back !
                </span>
            </div>
                                
            {searchBar && <SearchBar/>}
                                
            <div className='flex items-center gap-4'>
                {/* Search Icon */}
                <div className='relative'>
                    <FontAwesomeIcon
                        height={20}
                        width={20}
                        className={`cursor-pointer transition-all duration-200 hover:scale-110 ${
                            isdark ? "text-white hover:text-blue-400" : "text-gray-500 hover:text-blue-500"
                        }`}
                        icon={searchBar ? faClose : faSearch}
                        onClick={() => setSearchBar(!searchBar)}
                    />
                </div>
                
                {/* Logout Button - Fixed version */}
                <div 
                    className='relative'
                    onMouseEnter={() => setShowLogoutTooltip(true)}
                    onMouseLeave={() => setShowLogoutTooltip(false)}
                >
                    <Link
                        href="/authentication"
                        onClick={handleLogout}
                        className={`p-2 rounded-full transition-all duration-200 hover:scale-110 inline-block ${
                            isdark 
                                ? "hover:bg-red-900/20 text-red-400 hover:text-red-300" 
                                : "hover:bg-red-50 text-red-500 hover:text-red-600"
                        } ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <FontAwesomeIcon
                            height={18}
                            width={18}
                            icon={faSignOutAlt}
                        />
                    </Link>
                    
                    {/* Tooltip */}
                    {showLogoutTooltip && (
                        <div className={`absolute bottom-full right-0 mb-2 px-2 py-1 text-xs rounded whitespace-nowrap ${
                            isdark 
                                ? "bg-gray-800 text-white border border-gray-600" 
                                : "bg-gray-900 text-white"
                        }`}>
                            {isLoggingOut ? 'Signing out...' : 'Logout'}
                            <div className={`absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                                isdark ? "border-t-gray-800" : "border-t-gray-900"
                            }`}></div>
                        </div>
                    )}
                </div>
                
                {/* Alternative: If you prefer to use router.push like in sidebar */}
                {/* 
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                        isdark 
                            ? "hover:bg-red-900/20 text-red-400 hover:text-red-300" 
                            : "hover:bg-red-50 text-red-500 hover:text-red-600"
                    } ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <FontAwesomeIcon
                        height={18}
                        width={18}
                        icon={faSignOutAlt}
                    />
                </button>
                */}
            </div>
        </div>
    )
}