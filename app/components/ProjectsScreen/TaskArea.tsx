"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SingleTask from "./SingleTask";
import { useGlobalContext } from "../contextAPI";
import AddTaskCard from "./AddTaskCard";

export default function TaskArea() {
  const { taskwindow } = useGlobalContext();
  const { setOpenNewTaskBox } = taskwindow;

  return (
    <div className="rounded-xl p-4 md:p-6 h-full">
      {/* Top Section: Header + Add Button + Sorting */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Title and Add New */}
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-lg">Tasks</h2>
          <button
            onClick={() => setOpenNewTaskBox(true)}
            className="flex items-center gap-2 text-sm py-2 px-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white active:scale-95"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span className="hidden md:inline">Add new</span>
          </button>
        </div>

        {/* Right: Sort By Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 text-sm cursor-pointer">
            <span>Sort by:</span>
            <div className="flex items-center gap-1 text-mainColor font-medium">
              <span>Name</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-xs transition-transform group-hover:rotate-180" />
            </div>
          </div>

          {/* Dropdown Options */}
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Name</button>
            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Progress</button>
            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Due Date</button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-6 flex flex-col gap-3 h-[calc(100%-80px)] overflow-y-auto">
        <SingleTask />
        <SingleTask />
        <SingleTask />
        <SingleTask />
        <SingleTask />
      </div>

      {/* Add Task Card (input form) */}
      <AddTaskCard />
    </div>
  );
}
