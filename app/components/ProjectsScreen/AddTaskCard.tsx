"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import useGlobalContext from '../contextAPI';

type Priority = 'low' | 'medium' | 'high';

export default function AddTaskCard() {
    const { isdark, taskwindow } = useGlobalContext();
    const { openNewTaskBox, setOpenNewTaskBox } = taskwindow;
    
    const [dimensions, setDimensions] = useState({ 
        width: Math.min(590, typeof window !== 'undefined' ? window.innerWidth - 40 : 590),
        height: 400 
    });
    const [priority, setPriority] = useState<Priority>('medium');
    const [taskName, setTaskName] = useState('');

    useEffect(() => {
        const updateDimensions = () => {
            const newWidth = Math.min(590, window.innerWidth - 40);
            setDimensions({
                width: newWidth,
                height: Math.min(400, window.innerHeight - 40)
            });
        };

        if (openNewTaskBox && typeof window !== 'undefined') {
            updateDimensions();
            window.addEventListener('resize', updateDimensions);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', updateDimensions);
            }
        };
    }, [openNewTaskBox]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle task creation with taskName and priority
        console.log({ taskName, priority });
        setOpenNewTaskBox(false);
    };

    if (!openNewTaskBox) return null;

    return (
        <>
            <div 
                className="select-none fixed inset-0 bg-black z-30 transition-opacity duration-300 opacity-50" 
                onClick={() => setOpenNewTaskBox(false)}
            />
            
            <div 
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                }}
                className={`
                    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    p-6 py-7 rounded-lg flex flex-col z-40 shadow-md
                    transition-all duration-300 origin-center
                    ${isdark ? "bg-blue-950" : "bg-white"}
                `}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="flex justify-between items-center">
                    <h2 id="modal-title" className="font-semibold text-[20px] mt-1">
                        Add New Task
                    </h2>
                    <button 
                        onClick={() => setOpenNewTaskBox(false)}
                        aria-label="Close modal"
                        className="opacity-30 hover:opacity-100 transition-opacity"
                    >
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6 flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-2 px-3">
                        <label htmlFor="task-name" className="text-sm opacity-80">
                            Task Name
                        </label>
                        <input
                            id="task-name"
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className={`
                                border w-full border-gray-200 outline-none p-3
                                rounded-md text-[12px] ${isdark ? "bg-blue-950" : "bg-white"}
                            `}
                            placeholder="Type a name for your task"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2 px-3">
                        <label className="text-sm opacity-80">
                            Priority
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setPriority('low')}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                    priority === 'low' 
                                        ? 'bg-green-500 text-white' 
                                        : isdark 
                                            ? 'bg-gray-800' 
                                            : 'bg-gray-200'
                                }`}
                            >
                                Low
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority('medium')}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                    priority === 'medium' 
                                        ? 'bg-yellow-500 text-white' 
                                        : isdark 
                                            ? 'bg-gray-800' 
                                            : 'bg-gray-200'
                                }`}
                            >
                                Medium
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority('high')}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                    priority === 'high' 
                                        ? 'bg-red-500 text-white' 
                                        : isdark 
                                            ? 'bg-gray-800' 
                                            : 'bg-gray-200'
                                }`}
                            >
                                High
                            </button>
                        </div>
                    </div>

                    <div className="text-center mx-2 mt-auto">
                        <button 
                            type="submit"
                            className="bg-blue-500 w-full p-3 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}