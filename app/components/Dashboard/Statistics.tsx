"use client";
import { faDiagramProject, faLayerGroup, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../contextAPI";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../src/firebase";

interface StatisticsCard {
    text: string;
    number: number;
    icon: any;
    key: string;
}

export default function Statistics() {
    const [currentWidth, setCurrentWidth] = useState<number>(0);
    const [statsData, setStatsData] = useState({
        projects: 0,
        tasksCompleted: 0,
        categories: 0
    });
    const { isdark } = useGlobalContext();

    const debugTasks = async () => {
        try {
            const tasksSnapshot = await getDocs(collection(db, "tasks"));
            console.log("=== TASK DEBUG INFO ===");
            console.log("Total tasks found:", tasksSnapshot.size);
            
            tasksSnapshot.docs.forEach((doc, index) => {
                const data = doc.data();
                console.log(`Task ${index + 1}:`, {
                    id: doc.id,
                    data: data,
                    completed: data.completed,
                    status: data.status,
                    isCompleted: data.isCompleted,
                    isDone: data.isDone
                });
            });
            
            const completedByCompleted = tasksSnapshot.docs.filter(doc => doc.data().completed === true).length;
            const completedByStatus = tasksSnapshot.docs.filter(doc => doc.data().status === 'completed').length;
            const completedByIsCompleted = tasksSnapshot.docs.filter(doc => doc.data().isCompleted === true).length;
            
            console.log("Completed count by 'completed' field:", completedByCompleted);
            console.log("Completed count by 'status' field:", completedByStatus);
            console.log("Completed count by 'isCompleted' field:", completedByIsCompleted);
            console.log("=== END DEBUG INFO ===");
        } catch (error) {
            console.error("Error in debug:", error);
        }
    };

    const fetchStatistics = async () => {
        try {
            const projectsSnapshot = await getDocs(collection(db, "projects"));
            const projectsCount = projectsSnapshot.size;
            
            const tasksSnapshot = await getDocs(collection(db, "tasks"));
            const completedTasksCount = tasksSnapshot.docs.filter(doc => {
                const data = doc.data();
                return data.completed === true; 
            }).length;
            
            const categoriesSnapshot = await getDocs(collection(db, "categories"));
            const categoriesCount = categoriesSnapshot.size;

            console.log("Statistics Update:", {
                projects: projectsCount,
                tasksCompleted: completedTasksCount,
                categories: categoriesCount
            });

            setStatsData({
                projects: projectsCount,
                tasksCompleted: completedTasksCount,
                categories: categoriesCount
            });
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    useEffect(() => {
        fetchStatistics();
        
        const handleStatsUpdate = () => {
            fetchStatistics();
        };
        
        window.addEventListener("taskAdded", handleStatsUpdate);
        window.addEventListener("taskDeleted", handleStatsUpdate);
        window.addEventListener("taskCompleted", handleStatsUpdate);
        window.addEventListener("tasksUpdated", handleStatsUpdate);
        window.addEventListener("projectDeleted", handleStatsUpdate);
        window.addEventListener("projectAdded", handleStatsUpdate);
        window.addEventListener("projectUpdated", handleStatsUpdate);
        
        return () => {
            window.removeEventListener("taskAdded", handleStatsUpdate);
            window.removeEventListener("taskDeleted", handleStatsUpdate);
            window.removeEventListener("taskCompleted", handleStatsUpdate);
            window.removeEventListener("tasksUpdated", handleStatsUpdate);
            window.removeEventListener("projectDeleted", handleStatsUpdate);
            window.removeEventListener("projectAdded", handleStatsUpdate);
            window.removeEventListener("projectUpdated", handleStatsUpdate);
        };
    }, []);

    useEffect(() => {
        setCurrentWidth(window.innerWidth);
        
        const handleResize = () => setCurrentWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const statisticsCard: StatisticsCard[] = [
        {
            text: "Total Projects",
            number: statsData.projects,
            icon: faDiagramProject,
            key: "projects"
        },
        {
            text: "Tasks Completed",
            number: statsData.tasksCompleted,
            icon: faListCheck,
            key: "tasks"
        },
        {
            text: "Categories",
            number: statsData.categories,
            icon: faLayerGroup,
            key: "categories"
        }
    ];

    if (currentWidth === 0) {
        return (
            <div className={`m-5 rounded-xl p-8 flex gap-4 transition-all duration-300 ${
                isdark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100 shadow-sm"
            }`}>
                {statisticsCard.map((singleCard) => (
                    <div key={singleCard.key} className="flex flex-col items-center justify-center w-full h-full p-4">
                        <div className="group relative px-4 p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center w-full gap-12 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl blur-sm opacity-30 -z-10 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="flex flex-col gap-2">
                                <span className="font-bold text-3xl">{singleCard.number}</span>
                                <span className="font-light text-[12px] text-orange-100">{singleCard.text}</span>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                                <FontAwesomeIcon icon={singleCard.icon} className="text-white" width={20} height={20} />
                            </div>    
                        </div>
                    </div>
                ))}    
            </div>
        );
    }

    return (
        <div className={`m-5 rounded-xl p-8 flex gap-4 transition-all duration-300 ${
            isdark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100 shadow-sm"
        }`}>
            {statisticsCard.map((singleCard) => (
                <div key={singleCard.key} className="flex flex-col items-center justify-center w-full h-full p-4">
                    <Card singleCard={singleCard} currentWidth={currentWidth}/>
                </div>
            ))}
        </div>
    );
}

function Card({ singleCard, currentWidth }: { singleCard: StatisticsCard, currentWidth: number }) {
    const { text, number, icon } = singleCard;
    
    return (
        <div className={`group relative px-4 p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center w-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 ${
            currentWidth < 1318 ? "gap-6" : "gap-12"
        }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl blur-sm opacity-30 -z-10 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className={`flex flex-col gap-2 ${currentWidth < 750 ? "items-center" : ""}`}>
                <span className="font-bold text-3xl">{number}</span>
                <span className={`font-light text-[12px] text-orange-100 ${currentWidth < 750 ? "text-center" : ""}`}>{text}</span>
            </div>
            <div className={`h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110 ${
                currentWidth < 750 ? "hidden" : ""
            }`}>
                <FontAwesomeIcon icon={icon} className="text-white" width={20} height={20} />
            </div>    
        </div>
    );
}