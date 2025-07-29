import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faPodcast,
  faStar,
  faCoffee,
  faBolt,
  faHeart,
  faBook,
  faRocket,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../contextAPI";
import IconWindow from "./iconWindow";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type AddProjectProps = {
  onAdd: () => void;
};

export default function AddProject({ onAdd }: AddProjectProps) {
  const { isdark, projectwindow, iconBox, addProject, CategoryData } = useGlobalContext();
  const { openNewProjectBox, setopenNewProjectBox } = projectwindow;
  const { openIconBox, setOpenIconBox } = iconBox;
  const { categories } = CategoryData; // Get categories from context

  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const iconMap: Record<string, IconDefinition> = {
    star: faStar,
    coffee: faCoffee,
    bolt: faBolt,
    heart: faHeart,
    book: faBook,
    rocket: faRocket,
    smile: faSmile,
    podcast: faPodcast,
    close: faClose,
  };

  const [dimensions, setDimensions] = useState({
    width: Math.min(590, typeof window !== "undefined" ? window.innerWidth - 40 : 550),
    height: 400,
  });

  useEffect(() => {
    if (!openNewProjectBox) return;
    const updateDimensions = () => {
      setDimensions({
        width: Math.min(590, window.innerWidth - 40),
        height: Math.min(400, window.innerHeight - 40),
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [openNewProjectBox]);

  const handleIconSelect = (iconName: string) => {
    if (!iconMap[iconName]) {
      console.warn("Unknown icon selected:", iconName);
      return;
    }
    setSelectedIcon(iconName);
    setOpenIconBox(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !category || !selectedIcon) return;

    setLoading(true);
    try {
      await addProject({
        name: projectName.trim(),
        category: category, 
        icon: selectedIcon!,
      });

      setProjectName("");
      setCategory("");
      setSelectedIcon(null);
      setopenNewProjectBox(false);
      onAdd();
    } catch (err) {
      console.error("Failed to add project:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!openNewProjectBox) return null;

  return (
    <>
     
      <div
        className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 ${
          openNewProjectBox ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setopenNewProjectBox(false)}
      />

    
      <form
        onSubmit={handleSubmit}
        style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          p-6 py-7 rounded-lg flex flex-col z-40 shadow-md
          transition-all duration-300 origin-center overflow-y-auto
          ${isdark ? "bg-blue-950 text-white" : "bg-white text-black"}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
     
        <div className="flex justify-between items-center">
          <h2 id="modal-title" className="font-semibold text-[20px] mt-1">
            Add New Project
          </h2>
          <button
            type="button"
            onClick={() => setopenNewProjectBox(false)}
            aria-label="Close"
            className="opacity-30 hover:opacity-100 transition-opacity"
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        
        <div className="flex flex-col gap-6 mt-6 flex-1">
        
          <div className="flex flex-col gap-2 px-3">
            <label htmlFor="project-name" className="text-sm opacity-80">
              Project Name
            </label>
            <input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Type a name for your project"
              className={`border w-full border-gray-200 outline-none p-3 rounded-md text-[12px] ${
                isdark ? "bg-blue-950 text-white" : "bg-white text-black"
              }`}
              disabled={loading}
            />
          </div>

        
          <div className="flex flex-col gap-2 mx-3">
            <label htmlFor="project-category" className="text-sm opacity-80">
              Categories
            </label>
            <select
              id="project-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`
                p-3 text-[13px] outline-none border border-gray-200
                rounded-md ${isdark ? "bg-blue-950 text-white" : "bg-white text-black opacity-60"}
              `}
              disabled={loading}
            >
              <option value="">Select a Category...</option>
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available - Create one first
                </option>
              )}
            </select>
          </div>

       
          <div className="px-3">
            <button
              type="button"
              onClick={() => setOpenIconBox(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-400 hover:border-blue-500 transition"
              disabled={loading}
            >
              <FontAwesomeIcon
                icon={selectedIcon && iconMap[selectedIcon] ? iconMap[selectedIcon] : faPodcast}
                className="text-xl"
              />
              <span>{selectedIcon ? "Change Icon" : "Choose Icon"}</span>
            </button>
          </div>

       
          <div className="px-3">
            <button
              type="submit"
              disabled={!projectName || !category || !selectedIcon || loading}
              className={`w-full py-3 rounded-md text-white font-medium ${
                projectName && category && selectedIcon && !loading
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              {loading ? "Adding..." : "Add Project"}
            </button>
          </div>
        </div>

       
        {openIconBox && (
          <IconWindow selectedIcon={selectedIcon} setSelectedIcon={handleIconSelect} />
        )}
      </form>
    </>
  );
}