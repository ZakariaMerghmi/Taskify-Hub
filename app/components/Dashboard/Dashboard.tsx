import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import {useGlobalContext} from '../contextAPI';
import { faAngleDown, faBars, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
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
    const {isdark , Sidebar, Auth} = useGlobalContext();
    const {OpenSidebar , setOpenSidebar} = Sidebar;
    const {user} = Auth;
    
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
                        
            <div className='w-[130px] flex items-center justify-between'>
                <FontAwesomeIcon
                    height={20}
                    width={20}
                    className={`cursor-pointer ${isdark ? "text-white" : "text-gray-500"}`}
                    icon={searchBar ? faClose : faSearch}
                    onClick={() => setSearchBar(!searchBar)}
                />
                <div className='flex items-center gap-2'>
                    <div className='rounded-md bg-blue-500 h-8 w-8 md:h-11 md:w-11'></div>
                    <FontAwesomeIcon
                        height={20}
                        width={20}
                        icon={faAngleDown}
                        className={`font-bold cursor-pointer ${isdark ? "text-white" : "text-gray-500"}`}
                    />
                </div>
            </div>
        </div>
    )
}