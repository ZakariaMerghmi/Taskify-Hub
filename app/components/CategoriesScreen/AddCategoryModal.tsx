import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../contextAPI";

export const AddCategoryModal: React.FC = () => {
  const {
    CategoryWindow: { showAddCategoryBox, setShowAddCategoryBox },
    CategoryData: {  addCategory },
  } = useGlobalContext();

  const [categoryName, setCategoryName] = useState("");
  const [dimensions, setDimensions] = useState({
    width: Math.min(590, typeof window !== "undefined" ? window.innerWidth - 40 : 550),
    height: 300,
  });

  useEffect(() => {
    if (!showAddCategoryBox) return;
    const updateDimensions = () => {
      setDimensions({
        width: Math.min(590, window.innerWidth - 40),
        height: Math.min(300, window.innerHeight - 40),
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [showAddCategoryBox]);

  const handleAddCategory = () => {
    if (categoryName.trim() === "") return;
    addCategory(categoryName.trim());
    setCategoryName("");
    setShowAddCategoryBox(false);
  };

  if (!showAddCategoryBox) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black z-30 opacity-50"
        onClick={() => setShowAddCategoryBox(false)}
      />
      <div
        style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                   p-6 py-7 rounded-lg flex flex-col z-40 shadow-md bg-white text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[20px] mt-1">Add New Category</h2>
          <button
            onClick={() => setShowAddCategoryBox(false)}
            aria-label="Close"
            className="opacity-30 hover:opacity-100 transition-opacity"
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className="flex flex-col gap-6 mt-6 flex-1">
          <div className="flex flex-col gap-2 px-3">
            <label htmlFor="category-name" className="text-sm opacity-80">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Type a name for the category"
              className="border w-full border-gray-200 outline-none p-3 rounded-md text-[12px]"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory();
              }}
            />
          </div>

          <div className="px-3">
            <button
              onClick={handleAddCategory}
              disabled={!categoryName.trim()}
              className={`w-full py-3 rounded-md text-white font-medium ${
                categoryName.trim()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
