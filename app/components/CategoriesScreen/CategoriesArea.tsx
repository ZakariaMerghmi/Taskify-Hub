import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../contextAPI";
import { faEllipsis, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../src/firebase";

type Category = {
  id: string;
  name: string;
  userId?: string;
  [key: string]: any;
};

export default function CategoriesArea() {
  const { isdark, CategoryData, Auth } = useGlobalContext() as any;
  const { categories } = CategoryData;
  const { isDemoMode } = Auth;

  return (
    <div className={`${isdark ? "bg-gray-900" : "bg-slate-50"} h-[870px] p-4 space-y-3`}>
      {categories.length === 0 ? (
        <div className="text-center text-gray-400 text-sm italic mt-10">
          No categories yet. Click "Add New" to create one.
        </div>
      ) : (
        categories.map((category: Category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isDemoMode={isDemoMode()}
          />
        ))
      )}
    </div>
  );
}

function CategoryCard({
  category,
  isDemoMode,
}: {
  category: Category;
  isDemoMode: boolean;
}) {
  const { isdark, CategoryData } = useGlobalContext() as any;
  const { categories, setCategoryData } = CategoryData;
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmAndDelete = async () => {
    try {
      if (isDemoMode) {
     
        console.log('🎭 Demo mode - removing category from localStorage');
        const updatedCategories = categories.filter((cat: Category) => cat.id !== category.id);
        setCategoryData(updatedCategories);
        
    
        const currentDemoData = JSON.parse(localStorage.getItem('foxly_demo_data') || '{}');
        if (currentDemoData) {
          const updatedDemoData = {
            ...currentDemoData,
            categories: updatedCategories
          };
          localStorage.setItem('foxly_demo_data', JSON.stringify(updatedDemoData));
        }
      } else {
    
        console.log('🔥 Firebase mode - deleting from Firestore');
        await deleteDoc(doc(db, "categories", category.id));
        
   
        const updatedCategories = categories.filter((cat: Category) => cat.id !== category.id);
        setCategoryData(updatedCategories);
      }
      
      setShowDropdown(false);
      setConfirmDelete(false);
      console.log('✅ Category deleted successfully');
    } catch (error) {
      console.error("❌ Failed to delete category:", error);
    }
  };

  const handleEdit = () => {
    console.log("Editing category:", category.id);
    setShowDropdown(false);
   
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown-container')) {
        setShowDropdown(false);
        setConfirmDelete(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div
      className={`${
        isdark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      } p-4 flex px-16 rounded-md text-[14px] justify-between items-center relative mb-2 border transition-all hover:shadow-md category-dropdown-container`}
    >
      <div className="flex flex-col">
        <span className={`font-semibold ${isdark ? "text-white" : "text-gray-900"}`}>
          {category.name}
        </span>
        <span className="text-[12px] text-gray-400">
          Category {isDemoMode && "• Demo"}
        </span>
      </div>

      <div
        onClick={handleDropdownClick}
        className={`flex gap-5 w-6 h-6 items-center justify-center rounded-full cursor-pointer transition-colors ${
          isdark ? "hover:bg-gray-700" : "hover:bg-gray-200"
        }`}
      >
        <FontAwesomeIcon 
          icon={faEllipsis} 
          height={15} 
          width={15} 
          className="text-gray-500" 
        />
      </div>

      {showDropdown && (
        <div className={`absolute top-12 right-4 z-50 w-40 rounded-md shadow-lg border p-2 ${
          isdark 
            ? "bg-slate-800 border-slate-700" 
            : "bg-white border-gray-200"
        }`}>
          {!confirmDelete ? (
            <div className="py-1">
              <button
                onClick={handleEdit}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
                  isdark 
                    ? "text-gray-300 hover:bg-slate-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
                  isDemoMode 
                    ? "text-red-400 hover:bg-slate-700" 
                    : "text-red-600 hover:bg-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                Delete
              </button>
            </div>
          ) : (
            <div className="py-2 text-center text-sm">
              <p className={`mb-2 ${isdark ? "text-white" : "text-gray-900"}`}>
                Are you sure?
              </p>
              <div className="flex justify-around gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    isdark 
                      ? "border border-gray-600 text-gray-300 hover:bg-slate-700" 
                      : "border border-gray-400 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAndDelete}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}