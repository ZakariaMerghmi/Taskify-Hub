import React from "react";
import { useGlobalContext } from "../contextAPI";
import { faXmark, faProjectDiagram, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PieChart, Pie, Cell } from "recharts";
import TaskArea from "./TaskArea";

// Define colors for the chart
const COLORS = ["#FFFFFF", "rgba(255, 128, 66, 0)"];

const data = [
    { name: "Completed", value: 88 },
    { name: "Remaining", value: 12 }
];


function ProjectWindow({ project }: { project: any | null }) {
    const { projectwindow, isdark, Mobileview } = useGlobalContext();
    const { ismobileview } = Mobileview;
    const { openCreatedProjectBox, setopenCreatedProjectBox } = projectwindow;

    if (!openCreatedProjectBox || !project) return null;

    // Compute progress data dynamically:
    const progress = project.progress ?? { completed: 0, total: 1 };
    const completedPercent = Math.floor((progress.completed / progress.total) * 100);

    const pieData = [
      { name: "Completed", value: completedPercent },
      { name: "Remaining", value: 100 - completedPercent }
    ];

    return (
        <>
            <div
                className={`fixed inset-0 z-40 ${
                    isdark ? "bg-gray-900 bg-opacity-70" : "bg-gray-500 opacity-30"
                } backdrop-blur-sm transition-opacity `}
                onClick={() => setopenCreatedProjectBox(false)}
            />
            <div
                style={{
                    left: ismobileview ? "20px" : "180px",
                    right: "20px",
                    top: "20px",
                    bottom: "20px",
                }}
                className={`fixed rounded-xl z-50 shadow-2xl overflow-hidden transition-all transform ${
                    isdark ? "bg-gray-800" : "bg-white"
                }`}
            >
                <div className="p-6 h-[calc(100%-72px)] overflow-y-auto">
                    <div className="space-y-6">
                        <div className="p-10 py-11 bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-between px-5 md:px-10 relative">
                            <div className="flex gap-3 items-center">
                                <div>
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={faProjectDiagram}
                                            className="text-blue-500 p-2 mt-1 rounded-full text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex text-white flex-col">
                                        <span className="font-bold text-xl">{project.name}</span>
                                        <span className="font-light text-sm">
                                            {(project.tasks?.length ?? 0) + " Tasks"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute right-12 top-[22px]">
                                <div className="relative">
                                    <PieChart width={90} height={90}>
                                        <Pie
                                            data={pieData}
                                            cx={45}
                                            cy={45}
                                            innerRadius={35}
                                            outerRadius={40}
                                            fill="#0000"
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                    <div className="absolute top-[34px] left-[27px] flex flex-col justify-center items-center">
                                        <span className="text-[8px] font-light text-white">
                                            Completed
                                        </span>
                                        <span className="text-[16px] font-light text-white">
                                            {completedPercent}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <FontAwesomeIcon
                                    onClick={() => setopenCreatedProjectBox(false)}
                                    className="text-white top-4 right-4 opacity-80 absolute cursor-pointer"
                                    icon={faClose}
                                />
                            </div>
                        </div>
                        <TaskArea project={project} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProjectWindow;
