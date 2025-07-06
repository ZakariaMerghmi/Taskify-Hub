import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../contextAPI";
import { faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../src/firebase";
import { useEffect, useState } from "react";

// تعريف النوع Category
type Category = {
  id: string;
  name: string;
  [key: string]: any; // في حال فيه خصائص أخرى
};

export default function CategoriesArea() {
  const { isdark, DropDown: DropDownContext, CategoryData, setCategoryData } = useGlobalContext() as any;
  const { openDropDown, setopenDropDown, activeItemId, setActiveItemId } = DropDownContext;
  const { categories } = CategoryData;

  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const newCategories: Category[] = snapshot.docs.map((doc) => {
        const data = doc.data() as { name: string; [key: string]: any };
        return {
  id: doc.id,
  ...data,
  name: data.name, // this will overwrite if `data` had different name
};

      });
      setCategoryData((prev: any) => ({
        ...prev,
        categories: newCategories,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    const handleProjectDeleted = () => {
      fetchCategories();
    };

    window.addEventListener("projectDeleted", handleProjectDeleted);
    return () => {
      window.removeEventListener("projectDeleted", handleProjectDeleted);
    };
  }, []);

  // حذف التصنيف
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, "projects", categoryId));
      fetchCategories(); // تحديث القائمة بعد الحذف
      // إغلاق القائمة المنسدلة بعد الحذف
      setopenDropDown(false);
      setActiveItemId(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className={`${isdark ? "bg-gray-900" : "bg-slate-50"} h-[870px]`}>
      {loading ? (
        <div className="text-center text-gray-400 text-sm italic mt-10">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-gray-400 text-sm italic mt-10">
          No categories yet. Click “Add New” to create one.
        </div>
      ) : (
        categories.map((category: Category) => (
          <CategoryCard
            key={category.id}
            projectId={category.id}
            name={category.name}
            onDelete={() => handleDeleteCategory(category.id)}
          />
        ))
      )}
    </div>
  );
}

// ✅ تعريف واضح لـ CategoryCard
function CategoryCard({
  projectId,
  name,
  onDelete,
}: {
  projectId: string;
  name: string;
  onDelete: () => void; // إضافة الدالة للحذف
}) {
  const { isdark, DropDown: DropDownContext } = useGlobalContext() as any;
  const { openDropDown, setopenDropDown, activeItemId, setActiveItemId } = DropDownContext;

  const handleDropDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (activeItemId === projectId && openDropDown) {
      setopenDropDown(false);
      setActiveItemId(null);
    } else {
      setActiveItemId(projectId);
      setopenDropDown(true);
    }
  };

  const handleClose = () => {
    if (openDropDown) {
      setopenDropDown(false);
      setActiveItemId(null);
    }
  };

  return (
    <div
      className={`${isdark ? "bg-blue-950" : "bg-white"} p-4 flex px-6 rounded-md text-[14px] justify-between items-center relative`}
      onClick={handleClose}
    >
      <div className="flex flex-col">
        <span className="font-semibold">{name}</span>
        <span className="text-[12px] text-gray-400">Projects</span>
      </div>

      <div
        onClick={handleDropDown}
        className="flex gap-5 hover:bg-gray-200 w-6 h-6 items-center justify-center rounded-full cursor-pointer"
      >
        <FontAwesomeIcon icon={faEllipsis} height={15} width={15} className="text-gray-500" />
      </div>

      {openDropDown && activeItemId === projectId && (
        <div className="absolute top-10 right-4 z-10 bg-white shadow-md rounded-md p-2 w-32">
          {/* زر الحذف */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex items-center gap-2 text-red-600 hover:bg-red-100 p-2 rounded-md w-full"
            aria-label="Delete category"
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
