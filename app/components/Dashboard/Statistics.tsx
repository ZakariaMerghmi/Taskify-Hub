"use client";
import { faDiagramProject, faLayerGroup, faList, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGlobalContextProvider from "../contextAPI";
import { useEffect, useState } from "react";

interface StatisticsCard{
    text: string;
    number: number;
    icon: any
}

export default function Statistics() {
  const [currentWidth, setCurrentWidth] = useState<number>(0); // Initialize with 0 instead of window.innerWidth
  
  useEffect(() => {
    // Set initial width after component mounts (client-side only)
    setCurrentWidth(window.innerWidth);
    
    function handleWidth(){
      setCurrentWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleWidth);
    return () => {
      window.removeEventListener("resize", handleWidth);
    }
  }, []); 

  const statisticsCard: StatisticsCard[] = [
    {
        text: "Total Projects",
        number: 15,
        icon: faDiagramProject
    },
    {
        text: "Task Completed",
        number: 30,
        icon: faListCheck
    },
    {
        text: "Categories",
        number: 3,
        icon: faLayerGroup
    }
  ];

  const {isdark} = useGlobalContextProvider();
  
  
  if (currentWidth === 0) {
    return (
      <div className={`m-5 rounded-lg p-8 flex gap-4 ${
          isdark ? "bg-blue-950" : "bg-white"
      }`}>
        {statisticsCard.map((singleCard, index) => (
          <div key={index} className="flex flex-col items-center justify-center w-full h-full p-4 border rounded-lg shadow-md">
              <div className="px-4 p-3 rounded-b-md text-white bg-blue-500 flex items-center w-full gap-12">
                  <div className="flex flex-col gap-2">
                      <span className="font-bold text-3xl">{singleCard.number}</span>
                      <span className="font-light text-[12px]">{singleCard.text}</span>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                      <FontAwesomeIcon icon={singleCard.icon} className="text-blue-500" width={20} height={20} />
                  </div>    
              </div>
          </div>
        ))}    
      </div>
    );
  }
  
  return (
    <div className={`m-5 rounded-lg p-8 flex gap-4 ${
        isdark ? "bg-blue-950" : "bg-white"
    }`}>
      {statisticsCard.map((singleCard, index) => (
        <div key={index} className="flex flex-col items-center justify-center w-full h-full p-4 border rounded-lg shadow-md">
            <Card singleCard={singleCard} currentWidth={currentWidth}/>
        </div>
      ))}    
    </div>
  );
}

function Card({singleCard, currentWidth}: {singleCard: StatisticsCard, currentWidth: number}) {
    const { text, number, icon } = singleCard;
    
    return (
        <div className={`px-4 p-3 rounded-b-md text-white bg-blue-500 flex items-center w-full ${
            currentWidth < 1318 ? "gap-6" : "gap-12"
        }`}>
            <div className={`flex flex-col gap-2 ${currentWidth < 750 ? "items-center" : ""}`}>
                <span className="font-bold text-3xl">{number}</span>
                <span className={`font-light text-[12px] ${currentWidth < 750 ? "text-center" : ""}`}>{text}</span>
            </div>
            <div className={`h-12 w-12 rounded-full bg-white flex items-center justify-center ${
                currentWidth < 750 ? "hidden" : ""
            }`}>
                <FontAwesomeIcon icon={icon} className="text-blue-500" width={20} height={20} />
            </div>    
        </div>
    );
}