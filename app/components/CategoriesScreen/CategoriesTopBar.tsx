import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import { useGlobalContext } from "../contextAPI";

export default function CategoriesTopBar() {
  const { Mobileview, Sidebar, isdark, CategoryData, CategoryWindow } = useGlobalContext();
  const { OpenSidebar, setOpenSidebar } = Sidebar;
  const { ismobileview } = Mobileview; 
  const { showAddCategoryBox, setShowAddCategoryBox } = CategoryWindow;
  const { categories } = CategoryData;

  return (
    <div className={`p-8 pt-12 flex justify-between ${isdark ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex gap-7 items-center">
        <span className="flex flex-col">
          <span className="font-bold text-2xl">Categories</span>
          <p className="text-[12px] font-light">{categories.length} Categories</p>
        </span>
        <button
          onClick={() => setShowAddCategoryBox(true)}
          className="bg-blue-500 flex gap-1 items-center p-2 px-4 text-white rounded-md cursor-pointer active:scale-95"
          aria-label="Add new category"
        >
          <FontAwesomeIcon icon={faPlus} className="font-bold" />
          <p>add new</p>
        </button>
      </div>

      {ismobileview && (
        <div className='flex md:hidden'>
          <FontAwesomeIcon
            onClick={() => setOpenSidebar(!OpenSidebar)}
            height={14}
            width={14}
            icon={faBars}
            className={`${isdark ? "text-white" : "text-gray-800"}`}
            role="button"
            tabIndex={0}
            aria-label="Toggle sidebar"
          />
        </div>
      )}
    </div>
  );
}
