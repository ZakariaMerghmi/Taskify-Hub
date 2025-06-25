"use client";
import { useEffect, useState } from "react";
import useGlobalContextProvider from "../contextAPI";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface TaskData {
  day: string;
  tasks: number;
}

export default function CharBar() {
  const [isClient, setIsClient] = useState(false);
  const [mockData, setMockData] = useState<TaskData[]>([]);
  const { isdark } = useGlobalContextProvider();

  useEffect(() => {
    setIsClient(true);

    const data: TaskData[] = [
      { day: "Monday", tasks: 5 },
      { day: "Tuesday", tasks: 8 },
      { day: "Wednesday", tasks: 3 },
      { day: "Thursday", tasks: 6 },
      { day: "Friday", tasks: 7 },
      { day: "Saturday", tasks: 4 },
      { day: "Sunday", tasks: 2 },
    ];

    setMockData(data);
  }, []);

  if (!isClient) return null;

  return (
    <div
      className={`${
        isdark ? "bg-blue-950 text-white" : "bg-white text-black"
      } p-4 gap-8 flex flex-col rounded-md py-8`}
    >
      <div className="text-lg font-semibold ml-5">Daily Progress</div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasks" fill="#3B82F6" maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}