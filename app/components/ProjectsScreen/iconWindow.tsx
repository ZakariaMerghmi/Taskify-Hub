// IconWindow.tsx
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
  const { iconBox } = useGlobalContext();
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



  // Save currently selected icon in local state and update global selectedIcon
  const currentSelectedIcon = allIcons.find(icon => icon.isSelected)?.name || null;

const handleSave = () => {
  if (currentSelectedIcon) {
    setSelectedIcon(currentSelectedIcon);
    setOpenIconBox(false);
  }
};


  const handleClose = () => setOpenIconBox(false);

  if (!openIconBox) return null;

  return (
    <>
      <div
        className="w-full left-0 flex absolute justify-center items-center top-0"
        onClick={handleClose}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   bg-white z-50 p-6 rounded-xl w-[350px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="icon-picker-title"
      >
        <div className="flex flex-wrap gap-4 justify-center mb-6">
 {allIcons.map(({ name, isSelected }) => {
  const faIcon = iconList.find(icon => icon.name === name)?.icon;
  return (
    <div
      key={name}
      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
        isSelected ? "border-blue-500 bg-blue-100" : "border-gray-300"
      }`}
      onClick={() => handleIconClick(name)} 
    >
      <FontAwesomeIcon icon={faIcon!} className="text-xl" />
    </div>
  );
})}

</div>


       
      </div>
    </>
  );
}
