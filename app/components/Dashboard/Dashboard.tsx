// components/Dashboard.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useGlobalContext } from '../contextAPI';
import { faAngleDown, faBars, faClose, faDoorOpen, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBar from '../SearchBar';
import Statistics from './Statistics';
import RightSidebar from './RightSidebar';
import CharBar from './CharBar';
import RecentTasks from './RacentTasks';

const Dashboard = () => {
    const { isdark, Mobileview, Sidebar } = useGlobalContext();
    const { ismobileview } = Mobileview;
    const { OpenSidebar } = Sidebar;

    return (
        <div className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 
             ${OpenSidebar ? "md:ml-[280px] md:w-[calc(100%-280px)]" : ""}`}>
            <TopBar />
            <div 
                className={`${isdark ? "bg-transparent" : "bg-slate-50"}
                ${ismobileview ? "flex-col" : "flex-row"} flex`}
            >
                <div className={`${ismobileview ? "w-full" : "w-full lg:w-8/12"} border-r ${isdark ? "border-slate-700" : "border-slate-200"}`}>
                    <div className={`${ismobileview ? "p-4" : "p-8"} space-y-8 w-full`}>
                        <div className="space-y-8 w-full">
                            <Statistics />
                            <CharBar />
                            <RecentTasks />
                        </div>
                    </div>
                </div>
                <RightSidebar />
            </div>
        </div>
    );
};

export default Dashboard;

function TopBar() {
    const [searchBar, setSearchBar] = React.useState(false);
    const [showLogoutTooltip, setShowLogoutTooltip] = React.useState(false);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);
    const { isdark, Sidebar, Auth } = useGlobalContext();
    const { OpenSidebar, setOpenSidebar } = Sidebar;
    const { user, logout } = Auth;
    const router = useRouter();
    
    
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
            router.push('/authentication'); 
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className={`p-4 md:p-8 md:pt-12 flex items-center justify-between w-full ${isdark ? "bg-slate-900" : "bg-white"} transition-all duration-300`}>
            <div className='flex md:hidden'>
                <button
                    onClick={() => setOpenSidebar(!OpenSidebar)}
                    className={`group p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                        isdark 
                            ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    aria-label="Toggle sidebar"
                >
                    <FontAwesomeIcon
                        height={16}
                        width={16}
                        icon={faBars}
                        className={`transition-all duration-300 group-hover:text-orange-500 group-hover:scale-110`}
                    />
                </button>
            </div>
            
            <div className='flex flex-col'>
                <span className={`font-bold text-xl md:text-2xl bg-gradient-to-r ${isdark ? 'from-white to-gray-300' : 'from-slate-700 to-slate-900'} bg-clip-text text-transparent`}>
                    Hello, <span className={`font-light ${isdark ? 'text-slate-300' : 'text-slate-600'}`}>{firstName}</span>
                </span>
                <span className={`text-[12px] font-light ${isdark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Welcome back!
                </span>
            </div>
                                
            {searchBar && <SearchBar />}
                                
            <div className='flex items-center gap-4'>
                <div className='relative'>
                    <button
                        onClick={() => setSearchBar(!searchBar)}
                        className={`group p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                            isdark 
                                ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <FontAwesomeIcon
                            height={18}
                            width={18}
                            className={`transition-all duration-300 group-hover:text-orange-500 group-hover:scale-110`}
                            icon={searchBar ? faClose : faSearch}
                        />
                    </button>
                </div>
                
                {/* Logout Button */}
                <div 
                    className='relative'
                    onMouseEnter={() => setShowLogoutTooltip(true)}
                    onMouseLeave={() => setShowLogoutTooltip(false)}
                >
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`group p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                            isdark 
                                ? "hover:bg-red-900/20 text-slate-300 hover:text-red-400" 
                                : "hover:bg-red-50 text-slate-600 hover:text-red-600"
                        } ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <FontAwesomeIcon
                            height={18}
                            width={18}
                            icon={faSignOutAlt}
                            className="transition-all duration-300 group-hover:scale-110"
                        />
                    </button>
                    
                    {/* Tooltip */}
                    {showLogoutTooltip && (
                        <div className={`absolute bottom-full right-0 mb-2 px-3 py-2 text-xs rounded-lg shadow-lg whitespace-nowrap ${
                            isdark 
                                ? "bg-slate-800 text-slate-200 border border-slate-700" 
                                : "bg-slate-900 text-white"
                        }`}>
                            {isLoggingOut ? 'Signing out...' : 'Logout'}
                            <div className={`absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                                isdark ? "border-t-slate-800" : "border-t-slate-900"
                            }`}></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}