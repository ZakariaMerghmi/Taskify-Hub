import {useGlobalContext} from "../contextAPI";
import React from "react";
import LatestProjects from "./LatestProject";

export default function RightSidebar() {
    const { isdark , Mobileview} = useGlobalContext();
    const {ismobileview , setIsmobileview} = Mobileview;
  return (
    <div className={`${ismobileview?"":"w-4/12"}  p-4 flex gap-4 flex-col`}>
     <OverallProgress />
     <LatestProjects />
    </div>
  );
}

function OverallProgress() {
    const { isdark } = useGlobalContext();
  return (
    <div className={`mt-1 rounded-md p-4 h-64 flex gap-8 flex-col items-center justify-center ${
        isdark ? `bg-blue-950` : `bg-white `
      }`}>
      <span className="font-semibold text-lg">Overall Progress</span>
      <div className="rounded-full bg-blue-500 w-[120px] h-[120px] flex flex-col items-center justify-center gap-2">
          <span className="font-bold text-3xl text-white">76%</span>
          <span className="font-light text-white text-[11px]">Progress</span>
      </div>
    </div>
  );
}