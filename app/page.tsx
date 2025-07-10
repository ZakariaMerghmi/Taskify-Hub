'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from './components/contextAPI';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Sidebar';
import Projects from './components/ProjectsScreen/Projects';
import Categories from "./components/CategoriesScreen/Categories";

export default function Home() {
    const { isdark, DashboardItems, Auth } = useGlobalContext();
    const { menuItems } = DashboardItems;
    const { user, loading } = Auth;
    const router = useRouter();
    
   
    useEffect(() => {
        if (!loading && !user) {
            router.push('/authentication');
        }
    }, [user, loading, router]);

    
    if (loading) {
        return (
            <div className={`min-h-screen flex justify-center items-center 
                ${isdark ? 'bg-blue-950' : 'bg-gray-50'}`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-blue-500 text-lg">Loading...</div>
                </div>
            </div>
        );
    }

    
    if (!user) {
        return null;
    }

    const selectedItem = menuItems.find((item) => item.isSelected);
    let SelectedComponent = null;

    switch (selectedItem?.name) {
        case "Dashboard":
            SelectedComponent = <Dashboard />;
            break;
        case "Projects":
            SelectedComponent = <Projects />;
            break;
        case "Categories":
            SelectedComponent = <Categories />;
            break;
        default:
            break;
    }

    return (
        <div className={`poppins flex h-full w-full ${isdark ? "dark-mode" : "light-mode"}`}>
            <Sidebar />
            {SelectedComponent}
        </div>
    );
}