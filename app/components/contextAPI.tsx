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
import {
  faTachometerAlt,
  faBarsProgress,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

import { db, auth } from "../../src/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";

// Import Firebase Auth
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";

// --- Interfaces ---

export interface MenuItem {
  name: string;
  icon: string;
  isSelected: boolean;
}

interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
}

// --- Icon Mapping ---

const iconMap: Record<string, IconDefinition> = {
  "tachometer-alt": faTachometerAlt,
  "bars-progress": faBarsProgress,
  "layer-group": faLayerGroup,
};

export function getIconByName(name: string): IconDefinition | undefined {
  return iconMap[name];
}

// --- Global Context Type ---

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
  CategoryWindow: {
    showAddCategoryBox: boolean;
    setShowAddCategoryBox: (value: boolean) => void;
  };
  CategoryData: {
    categories: Category[];
    addCategory: (name: string) => Promise<void>;
    setCategoryData: Dispatch<SetStateAction<Category[]>>;
  };
  Auth: AuthContext;
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => Promise<void>;
}

// --- Context Setup ---

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [isdark, setisdark] = useState(false);
  const [OpenSidebar, setOpenSidebar] = useState(false);
  const [ismobileview, setIsmobileview] = useState(false);
  const [openDropDown, setopenDropDown] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [openCreatedProjectBox, setopenCreatedProjectBox] = useState(false);
  const [showAddCategoryBox, setShowAddCategoryBox] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: "Dashboard", icon: "tachometer-alt", isSelected: true },
    { name: "Projects", icon: "bars-progress", isSelected: false },
    { name: "Categories", icon: "layer-group", isSelected: false },
  ]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [openNewProjectBox, setopenNewProjectBox] = useState(false);
  const [openIconBox, setOpenIconBox] = useState(false);
  const [openNewTaskBox, setOpenNewTaskBox] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const projectsCollection = collection(db, "projects");
  const categoriesCollection = collection(db, "categories");

  // Add Category
  const addCategory = async (name: string) => {
    if (name.trim() === "") return;
    try {
      const docRef = await addDoc(categoriesCollection, { name });
      const newCategory: Category = { id: docRef.id, name };
      setCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      console.error("Failed to add category:", error);
      throw error;
    }
  };

  // Authentication functions
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };
  
  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      setUser(userCredential.user);
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Failed to logout");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw new Error(error.message || "Failed to send password reset email");
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch data & responsive mobile view handler
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

    async function fetchCategories() {
      try {
        const snapshot = await getDocs(categoriesCollection);
        const categoriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Category, "id">),
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    fetchProjects();
    fetchCategories();

    function handleResize() {
      if (typeof window !== "undefined") {
        setIsmobileview(window.innerWidth <= 1400);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add Project
  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const docRef = await addDoc(projectsCollection, project);
      setProjects((prev) => [...prev, { ...project, id: docRef.id }]);
    } catch (error) {
      console.error("Failed to add project:", error);
      throw error;
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
        CategoryWindow: {
          showAddCategoryBox,
          setShowAddCategoryBox,
        },
        iconBox: { openIconBox, setOpenIconBox },
        DropDown: {
          openDropDown,
          setopenDropDown,
          activeItemId,
          setActiveItemId,
        },
        taskwindow: { openNewTaskBox, setOpenNewTaskBox },
        CategoryData: {
          categories,
          addCategory,
          setCategoryData: setCategories,
        },
        Auth: {
          user,
          login,
          signup,
          logout,
          resetPassword,
          loading
        },
        projects,
        addProject,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// --- Custom Hook ---

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalContextProvider");
  }
  return context;
}