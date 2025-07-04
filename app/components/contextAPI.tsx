// GlobalContextProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTachometerAlt,
  faBarsProgress,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

import { db } from "../../src/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";

// --- تعريف الواجهات ---

export interface MenuItem {
  name: string;
  icon: string; // اسم الأيقونة كسلسلة نصية
  isSelected: boolean;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  icon: string; // اسم الأيقونة كسلسلة نصية
}

interface GlobalContextType {
  isdark: boolean;
  setisdark: (value: boolean) => void;
  Sidebar: {
    OpenSidebar: boolean;
    setOpenSidebar: (value: boolean) => void;
  };
  Mobileview: {
    ismobileview: boolean;
    setIsmobileview: (value: boolean) => void;
  };
  DashboardItems: {
    menuItems: MenuItem[];
    setMenuItems: Dispatch<SetStateAction<MenuItem[]>>;
  };
  projectwindow: {
    openNewProjectBox: boolean;
    setopenNewProjectBox: (value: boolean) => void;
    openCreatedProjectBox: boolean;
    setopenCreatedProjectBox: (value: boolean) => void;
  };
  iconBox: {
    openIconBox: boolean;
    setOpenIconBox: (value: boolean) => void;
  };
  DropDown: {
    openDropDown: boolean;
    setopenDropDown: (value: boolean) => void;
    activeItemId: string | null;
    setActiveItemId: (id: string | null) => void;
  };
  taskwindow: {
    openNewTaskBox: boolean;
    setOpenNewTaskBox: (value: boolean) => void;
  };
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => Promise<void>;
}

// --- دالة تحويل اسم الأيقونة إلى IconDefinition ---

const iconMap: Record<string, IconDefinition> = {
  "tachometer-alt": faTachometerAlt,
  "bars-progress": faBarsProgress,
  "layer-group": faLayerGroup,
};

export function getIconByName(name: string): IconDefinition | undefined {
  return iconMap[name];
}

// --- إنشاء الـ Context ---

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// --- المزود ---

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [isdark, setisdark] = useState(false);
  const [OpenSidebar, setOpenSidebar] = useState(false);
  const [ismobileview, setIsmobileview] = useState(false);
  const [openDropDown, setopenDropDown] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [openCreatedProjectBox, setopenCreatedProjectBox] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: "Dashboard", icon: "tachometer-alt", isSelected: true },
    { name: "Projects", icon: "bars-progress", isSelected: false },
    { name: "Categories", icon: "layer-group", isSelected: false },
  ]);

  const [openNewProjectBox, setopenNewProjectBox] = useState(false);
  const [openIconBox, setOpenIconBox] = useState(false);
  const [openNewTaskBox, setOpenNewTaskBox] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);

  const projectsCollection = collection(db, "projects");

  // تحميل المشاريع من Firebase عند بداية التحميل
  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(projectsCollection, orderBy("name", "asc"));
        const snapshot = await getDocs(q);
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Project, "id">),
        })) as Project[];
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }
    fetchProjects();

    // إعداد الموبايل فيو حسب حجم الشاشة
    function handleResize() {
      if (typeof window !== "undefined") {
        setIsmobileview(window.innerWidth <= 1400);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // دالة إضافة مشروع جديد إلى Firebase
  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const docRef = await addDoc(projectsCollection, project);
      setProjects((prev) => [...prev, { ...project, id: docRef.id }]);
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isdark,
        setisdark,
        Sidebar: { OpenSidebar, setOpenSidebar },
        Mobileview: { ismobileview, setIsmobileview },
        DashboardItems: { menuItems, setMenuItems },
        projectwindow: {
          openNewProjectBox,
          setopenNewProjectBox,
          openCreatedProjectBox,
          setopenCreatedProjectBox,
        },
        iconBox: { openIconBox, setOpenIconBox },
        DropDown: { openDropDown, setopenDropDown, activeItemId, setActiveItemId },
        taskwindow: { openNewTaskBox, setOpenNewTaskBox },
        projects,
        addProject,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// --- هوك لاستخدام السياق ---

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalContextProvider");
  }
  return context;
}
