"use client";
import { faDashboard, faBarsProgress, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, createContext, ReactNode, useEffect, Dispatch, SetStateAction } from "react";

interface MenuItem {
    name: string;
    icon: any;
    isSelected: boolean;
}

interface GlobalContext {
    isdark: boolean;
    setisdark: (isdark: boolean) => void;
    Sidebar: {
        OpenSidebar: boolean;
        setOpenSidebar: (OpenSidebar: boolean) => void;
    };
    Mobileview: {
        ismobileview: boolean;
        setIsmobileview: (ismobileview: boolean) => void;
    };
    DashboardItems: {
        menuItems: MenuItem[];
        setMenuItems: Dispatch<SetStateAction<MenuItem[]>>;
    };
    projectwindow: {
        openNewProjectBox: boolean;
        setopenNewProjectBox: (openNewProjectBox: boolean) => void;
         openCreatedProjectBox: boolean;
        setopenCreatedProjectBox: (openNewProjectBox: boolean) => void;
    };
    iconBox: {
        openIconBox: boolean;
        setOpenIconBox: (openIconBox: boolean) => void;
    }; 
    DropDown: {
        openDropDown: boolean;
        setopenDropDown: (openDropDown: boolean) => void;
        activeItemId: string | null;
        setActiveItemId: (id: string | null) => void;
    }; 
      taskwindow: { // Added separate task window states
        openNewTaskBox: boolean;
        setOpenNewTaskBox: (open: boolean) => void;
    };
}

const GlobalContext = createContext<GlobalContext | undefined>(undefined);

function GlobalContextProvider({ children }: { children: ReactNode }) {
    const [isdark, setisdark] = useState<boolean>(false);
    const [OpenSidebar, setOpenSidebar] = useState<boolean>(false);
    const [ismobileview, setIsmobileview] = useState<boolean>(false);
    const [openDropDown, setopenDropDown] = useState<boolean>(false);
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
     const [openCreatedProjectBox, setopenCreatedProjectBox] = useState<boolean>(false);

    const [menuItems, setMenuItems] = useState<MenuItem[]>([
        { name: 'Dashboard', icon: faDashboard, isSelected: true },
        { name: 'Projects', icon: faBarsProgress, isSelected: false },
        { name: 'Categories', icon: faLayerGroup, isSelected: false },
    ]);
    const [openNewProjectBox, setopenNewProjectBox] = useState<boolean>(false);
    const [openIconBox, setOpenIconBox] = useState<boolean>(false);
    const [openNewTaskBox, setOpenNewTaskBox] = useState<boolean>(false);   

    useEffect(() => {
        function handleResize() {
            if (typeof window !== 'undefined') {
                setIsmobileview(window.innerWidth <= 1400);
            }
        }

        handleResize();
        if (typeof window !== 'undefined') {
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isdark,
                setisdark,
                Sidebar: {
                    OpenSidebar,
                    setOpenSidebar,
                },
                Mobileview: {
                    ismobileview,
                    setIsmobileview,
                },
                DashboardItems: {
                    menuItems,
                    setMenuItems,
                },
                projectwindow: {
                    openNewProjectBox,
                    setopenNewProjectBox,
                    openCreatedProjectBox,
                    setopenCreatedProjectBox,
                },
                iconBox: {
                    openIconBox,
                    setOpenIconBox,
                },
                DropDown: {
                    openDropDown,
                    setopenDropDown,
                    activeItemId,
                    setActiveItemId,
                },
                 taskwindow: { 
                    openNewTaskBox,
                    setOpenNewTaskBox,
                },
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

function useGlobalContext() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobalContext must be used within a GlobalContextProvider');
    }
    return context;
}

export { GlobalContextProvider };
export default useGlobalContext;