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
  where,
} from "firebase/firestore";

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";


interface DemoUser extends User {
  isDemo?: boolean;
}

// FIXED DEMO USER CONFIGURATION
const DEMO_USER_CONFIG = {
  uid: 'demo-user-foxly',
  email: 'demo@foxly.com',
  displayName: 'Demo User',
  photoURL: null,
  isDemo: true
};

const BASE_DEMO_DATA = {
  projects: [], 
  categories: [] 
};

export interface MenuItem {
  name: string;
  icon: string;
  isSelected: boolean;
}

interface AuthContext {
  user: DemoUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  loginDemo: () => Promise<void>;
  isDemoMode: () => boolean;
  getDemoData: () => any;
  exitDemo: () => void;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  icon: string;
  userId?: string; 
}

export interface Category {
  id: string;
  name: string;
  userId?: string; 
}

const iconMap: Record<string, IconDefinition> = {
  "tachometer-alt": faTachometerAlt,
  "bars-progress": faBarsProgress,
  "layer-group": faLayerGroup,
};

export function getIconByName(name: string): IconDefinition | undefined {
  return iconMap[name];
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
    deleteFunction: (() => Promise<void>) | null;
    setDeleteFunction: (fn: (() => Promise<void>) | null) => void;
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
  setProjects: Dispatch<SetStateAction<Project[]>>;
  addProject: (project: Omit<Project, "id" | "userId">) => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [isdark, setisdark] = useState(false);
  const [OpenSidebar, setOpenSidebar] = useState(false);
  const [ismobileview, setIsmobileview] = useState(false);
  const [openDropDown, setopenDropDown] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<(() => Promise<void>) | null>(null);
  const [openCreatedProjectBox, setopenCreatedProjectBox] = useState(false);
  const [showAddCategoryBox, setShowAddCategoryBox] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: "Dashboard", icon: "tachometer-alt", isSelected: true },
    { name: "Projects", icon: "bars-progress", isSelected: false },
    { name: "Categories", icon: "layer-group", isSelected: false },
  ]);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [openNewProjectBox, setopenNewProjectBox] = useState(false);
  const [openIconBox, setOpenIconBox] = useState(false);
  const [openNewTaskBox, setOpenNewTaskBox] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const projectsCollection = collection(db, "projects");
  const categoriesCollection = collection(db, "categories");

  
  const getDemoStorageKey = (type: 'data') => {
    return `foxly_demo_${type}`;
  };

  const saveDemoData = (data: any) => {
    if (typeof window === 'undefined') return;
    const storageKey = getDemoStorageKey('data');
    localStorage.setItem(storageKey, JSON.stringify(data));
    localStorage.setItem('foxly_demo_mode', 'true');
  };

  const loadDemoData = () => {
    if (typeof window === 'undefined') return null;
    
    const storageKey = getDemoStorageKey('data');
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  };

  const isDemoMode = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('foxly_demo_mode') === 'true';
  };

  const getDemoData = () => {
    return loadDemoData();
  };


  const loginDemo = async () => {
    try {
      setLoading(true);
      
     
      const demoUser = { ...DEMO_USER_CONFIG } as DemoUser;
      

      let demoData = loadDemoData();
      if (!demoData) {
        demoData = {
          user: demoUser,
          projects: [...BASE_DEMO_DATA.projects],
          categories: [...BASE_DEMO_DATA.categories]
        };
        saveDemoData(demoData);
      }
      
 
      setUser(demoUser);
      setProjects(demoData.projects || []);
      setCategories(demoData.categories || []);
      
      console.log('Demo login successful');
    } catch (error) {
      console.error('Demo login failed:', error);
      throw new Error('Demo access temporarily unavailable');
    } finally {
      setLoading(false);
    }
  };

  const exitDemo = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('foxly_demo_mode');
    localStorage.removeItem(getDemoStorageKey('data'));
    
    setUser(null);
    setProjects([]);
    setCategories([]);
  };


  const addProject = async (project: Omit<Project, "id" | "userId">) => {
    console.log('🚀 Adding project:', project);
    console.log('👤 Current user:', user ? { uid: user.uid, email: user.email } : 'No user');
    
    if (!user?.uid) {
      console.error('❌ No user UID available');
      throw new Error('User must be logged in to add projects');
    }

    if (isDemoMode()) {
      console.log('🎭 Demo mode - adding to localStorage');
      const newProject = { 
        ...project, 
        id: `demo-proj-${Date.now()}`,
        userId: user.uid
      };
      
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      
    
      const currentDemoData = loadDemoData();
      if (currentDemoData) {
        const updatedDemoData = {
          ...currentDemoData,
          projects: updatedProjects
        };
        saveDemoData(updatedDemoData);
      }
      
      console.log('✅ Demo project added:', newProject.name);
      return;
    }
    
    
    try {
      console.log('🔥 Adding to Firebase...');
      const projectWithUserId = { ...project, userId: user.uid };
      console.log('📄 Project data to save:', projectWithUserId);
      
      const docRef = await addDoc(projectsCollection, projectWithUserId);
      console.log('✅ Firebase document created with ID:', docRef.id);
      
      const newProject = { ...projectWithUserId, id: docRef.id };
      setProjects((prev) => {
        console.log('📊 Previous projects count:', prev.length);
        const updated = [...prev, newProject];
        console.log('📊 Updated projects count:', updated.length);
        return updated;
      });
      
      console.log('✅ Project added successfully:', newProject);
    } catch (error) {
      console.error("❌ Failed to add project:", error);
      console.error("🔍 Error details:", error);
      throw error;
    }
  };

 
  const addCategory = async (name: string) => {
    console.log('🚀 Adding category:', name);
    console.log('👤 Current user:', user ? { uid: user.uid, email: user.email } : 'No user');
    
    if (name.trim() === "") return;
    
    if (!user?.uid) {
      console.error('❌ No user UID available');
      throw new Error('User must be logged in to add categories');
    }
    
    if (isDemoMode()) {
      console.log('🎭 Demo mode - adding to localStorage');
      const newCategory: Category = { 
        id: `demo-cat-${Date.now()}`, 
        name: name.trim(),
        userId: user.uid
      };
      
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      
    
      const currentDemoData = loadDemoData();
      if (currentDemoData) {
        const updatedDemoData = {
          ...currentDemoData,
          categories: updatedCategories
        };
        saveDemoData(updatedDemoData);
      }
      
      console.log('✅ Demo category added:', newCategory.name);
      return;
    }
    
  
    try {
      console.log('🔥 Adding to Firebase...');
      const categoryWithUserId = { name, userId: user.uid };
      console.log('📄 Category data to save:', categoryWithUserId);
      
      const docRef = await addDoc(categoriesCollection, categoryWithUserId);
      console.log('✅ Firebase document created with ID:', docRef.id);
      
      const newCategory: Category = { id: docRef.id, name, userId: user.uid };
      setCategories((prev) => {
        console.log('📊 Previous categories count:', prev.length);
        const updated = [...prev, newCategory];
        console.log('📊 Updated categories count:', updated.length);
        return updated;
      });
      
      console.log('✅ Category added successfully:', newCategory);
    } catch (error) {
      console.error("❌ Failed to add category:", error);
      console.error("🔍 Error details:", error);
      throw error;
    }
  };

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
    if (isDemoMode()) {
      exitDemo();
      return;
    }
    
    try {
      await signOut(auth);
      setUser(null);
      setProjects([]);
      setCategories([]);
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

  
  useEffect(() => {
   
    const isDemoActive = localStorage.getItem('foxly_demo_mode') === 'true';
    
    if (isDemoActive) {
      const demoData = loadDemoData();
      if (demoData && demoData.user) {
        setUser(demoData.user);
        setProjects(demoData.projects || []);
        setCategories(demoData.categories || []);
        setLoading(false);
        console.log('Demo session restored');
        return;
      }
    }


    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    console.log('🔍 Data fetch useEffect triggered');
    console.log('📊 Current state:', {
      isDemoMode: isDemoMode(),
      user: user ? { uid: user.uid, email: user.email, isDemo: (user as DemoUser).isDemo } : null,
      projectsCount: projects.length,
      categoriesCount: categories.length
    });


    if (isDemoMode()) {
      console.log('⏭️ Skipping fetch - Demo mode active');
      return;
    }
    
    if (!user) {
      console.log('⏭️ Skipping fetch - No user');
      return;
    }
    
    if ((user as DemoUser).isDemo) {
      console.log('⏭️ Skipping fetch - Demo user detected');
      return;
    }

   
    if (!user?.uid) {
      console.warn('⚠️ User UID is not available, skipping data fetch');
      return;
    }

    console.log('🚀 Starting Firebase data fetch for user:', user.uid);

    async function fetchUserProjects() {
      if (!user?.uid) return; 
      
      try {
        console.log('📁 Fetching projects for user:', user.uid);
        
      
        const q = query(
          projectsCollection, 
          where("userId", "==", user.uid)
        );
        
        console.log('📝 Executing projects query...');
        const snapshot = await getDocs(q);
        console.log('📋 Projects query result:', {
          empty: snapshot.empty,
          size: snapshot.size,
          docs: snapshot.docs.length
        });

        if (!snapshot.empty) {
          snapshot.docs.forEach((doc, index) => {
            console.log(`📄 Project ${index + 1}:`, {
              id: doc.id,
              data: doc.data()
            });
          });
        }

        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Project, "id">),
        })) as Project[];
        
   
        const sortedProjects = projectsData.sort((a, b) => a.name.localeCompare(b.name));
        setProjects(sortedProjects);
        console.log(`✅ Successfully set ${sortedProjects.length} projects for user:`, user.uid);
      } catch (error) {
        console.error("❌ Failed to fetch user projects:", error);
        console.error("🔍 Error details:", error);
      }
    }

    async function fetchUserCategories() {
      if (!user?.uid) return; 
      
      try {
        console.log('📂 Fetching categories for user:', user.uid);
        
     
        const q = query(
          categoriesCollection,
          where("userId", "==", user.uid)
        );
        
        console.log('📝 Executing categories query...');
        const snapshot = await getDocs(q);
        console.log('📋 Categories query result:', {
          empty: snapshot.empty,
          size: snapshot.size,
          docs: snapshot.docs.length
        });

        if (!snapshot.empty) {
          snapshot.docs.forEach((doc, index) => {
            console.log(`📄 Category ${index + 1}:`, {
              id: doc.id,
              data: doc.data()
            });
          });
        }

        const categoriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Category, "id">),
        })) as Category[];
        
      
        const sortedCategories = categoriesData.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedCategories);
        console.log(`✅ Successfully set ${sortedCategories.length} categories for user:`, user.uid);
      } catch (error) {
        console.error("❌ Failed to fetch user categories:", error);
        console.error("🔍 Error details:", error);
      }
    }

    fetchUserProjects();
    fetchUserCategories();

    function handleResize() {
      if (typeof window !== "undefined") {
        setIsmobileview(window.innerWidth <= 1400);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user]);

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
          deleteFunction,
          setDeleteFunction,
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
          loading,
          loginDemo,
          isDemoMode,
          getDemoData,
          exitDemo
        },
        projects,
        addProject,
        setProjects, 
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalContextProvider");
  }
  return context;
}