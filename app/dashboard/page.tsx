'use client';

import { useEffect } from 'react';
import {useGlobalContext} from '../components/contextAPI';
import Dashboard from '../components/Dashboard/Dashboard';
import Sidebar from '../components/Sidebar';
import Projects from '../components/ProjectsScreen/Projects';
import Categories from "../components/CategoriesScreen/Categories"
import { GlobalContextProvider } from '../components/contextAPI';

export default function Home() {
    const {isdark, DashboardItems} = useGlobalContext();
    const {menuItems } = DashboardItems;
    const selectesItem = menuItems.find((item)=>item.isSelected)
    let SelectedComponent = null
    switch(selectesItem ?.name){
      case "Dashboard":
        SelectedComponent = <Dashboard/>;
        break;
      case "Projects":
        SelectedComponent = <Projects/>;
        break;
      case "Categories":
        SelectedComponent = <Categories/>;
        break;

       default:
       break; 
    }
  return (
    
    <div className={`poppins flex h-full w-full  
    ${isdark ? "dark-mode" : "light-mode"}
    `}>
      <Sidebar  />
      {SelectedComponent}
    </div>
   
  );
}
