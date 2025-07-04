import React, { useEffect, useRef, useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../contextAPI";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../src/firebase";

export default function DropDown() {
    const { isdark, DropDown } = useGlobalContext();
    const { openDropDown, setopenDropDown, activeItemId } = DropDown;
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Delete project from Firebase
    const confirmAndDelete = async () => {
        if (!activeItemId) return;
        try {
            await deleteDoc(doc(db, "projects", activeItemId));
            setopenDropDown(false);
            setConfirmDelete(false);
           
            window.dispatchEvent(new Event('projectDeleted')); 
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const handleEdit = () => {
        console.log("Editing project:", activeItemId);
        setopenDropDown(false);
    };

    const handleDelete = () => {
        setConfirmDelete(true);
    };

    useEffect(() => {
        const updatePosition = () => {
            if (openDropDown && activeItemId) {
                const trigger = document.querySelector(`[data-project-id="${activeItemId}"]`);
                if (trigger) {
                    const rect = trigger.getBoundingClientRect();
                    setPosition({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX
                    });
                }
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setopenDropDown(false);
                setConfirmDelete(false);
            }
        };

        if (openDropDown) {
            updatePosition();
            document.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("resize", updatePosition);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", updatePosition);
        };
    }, [openDropDown, setopenDropDown, activeItemId]);

    if (!openDropDown) return null;

    return (
        <div 
            ref={dropdownRef}
            className={`fixed z-50 w-40 rounded-md shadow-lg border p-2 ${
                isdark 
                    ? "bg-slate-800 border-slate-700" 
                    : "bg-white border-gray-200"
            }`}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`
            }}
        >
            {!confirmDelete ? (
                <div className="py-1">
                    <button
                        onClick={handleEdit}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left ${
                            isdark 
                                ? "text-gray-300 hover:bg-slate-700" 
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left ${
                            isdark 
                                ? "text-red-400 hover:bg-slate-700" 
                                : "text-red-600 hover:bg-gray-100"
                        }`}
                    >
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                        Delete
                    </button>
                </div>
            ) : (
                <div className="py-2 text-center text-sm">
                    <p>Are you sure?</p>
                    <div className="flex justify-around mt-2">
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="px-3 py-1 rounded border border-gray-400 hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmAndDelete}
                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
