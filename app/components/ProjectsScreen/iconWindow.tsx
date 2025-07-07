"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCoffee,
  faBolt,
  faClose,
  faHeart,
  faBook,
  faRocket,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useGlobalContext } from "../contextAPI";

interface IconWindowProps {
  selectedIcon: string | null;
  setSelectedIcon: (iconName: string) => void;
}

const iconList: { name: string; icon: IconDefinition }[] = [
  { name: "star", icon: faStar },
  { name: "coffee", icon: faCoffee },
  { name: "bolt", icon: faBolt },
  { name: "heart", icon: faHeart },
  { name: "book", icon: faBook },
  { name: "rocket", icon: faRocket },
  { name: "smile", icon: faSmile },
];

export default function IconWindow({ selectedIcon, setSelectedIcon }: IconWindowProps) {
  const { iconBox, isdark } = useGlobalContext();
  const { openIconBox, setOpenIconBox } = iconBox;

  const [allIcons, setAllIcons] = useState(
    iconList.map(({ name }) => ({
      name,
      isSelected: selectedIcon === name,
    }))
  );

  useEffect(() => {
    setAllIcons(
      iconList.map(({ name }) => ({
        name,
        isSelected: selectedIcon === name,
      }))
    );
  }, [selectedIcon]);

  const handleIconClick = (name: string) => {
    setSelectedIcon(name);  
    setOpenIconBox(false); 
  };

  const handleClose = () => setOpenIconBox(false);

  if (!openIconBox) return null;

  return (
    <>
      <div
        className={`w-full h-full fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isdark ? "opacity-70" : "opacity-50"
        }`}
        onClick={handleClose}
      />
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-6 rounded-xl w-[350px] shadow-xl ${
          isdark ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="icon-picker-title"
      >
        <h2 
          className={`text-lg font-semibold mb-4 ${
            isdark ? "text-white" : "text-gray-800"
          }`}
          id="icon-picker-title"
        >
          Select an Icon
        </h2>
        
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {allIcons.map(({ name, isSelected }) => {
            const faIcon = iconList.find(icon => icon.name === name)?.icon;
            return (
              <div
                key={name}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? isdark 
                      ? "border-blue-400 bg-blue-900" 
                      : "border-blue-500 bg-blue-100"
                    : isdark 
                      ? "border-gray-600 hover:border-gray-500" 
                      : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleIconClick(name)} 
              >
                <FontAwesomeIcon 
                  icon={faIcon!} 
                  className={`text-xl ${
                    isdark 
                      ? isSelected ? "text-blue-300" : "text-gray-300" 
                      : isSelected ? "text-blue-600" : "text-gray-600"
                  }`} 
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isdark 
                ? "bg-gray-700 text-white hover:bg-gray-600" 
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}