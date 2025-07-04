import Checkbox from '@mui/material/Checkbox';
import {useGlobalContext} from "../contextAPI";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function SingleTask() {
  const { isdark } = useGlobalContext();
  
  return (
    <div className={`p-3 rounded-lg ${
      isdark ? "bg-blackColorDark" : "bg-slate-50"
    } flex justify-between items-start`}>  
      <div className="flex gap-2">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <Checkbox
              sx={{
                color: 'blue.500',
                '&.Mui-checked': {
                  color: 'blue.500',
                },
              }}
            />
            <span>Task 1</span>
          </div>
          <button className="bg-blue-500 px-7 py-1 rounded-md text-[10px] text-white mt-1 ml-8 active:scale-95">
            Low
          </button>
        </div>
      </div>
      <button className="p-1">
        <FontAwesomeIcon 
          icon={faEllipsisVertical} 
          className="text-gray-400 hover:text-gray-600"
        />
      </button>
    </div>
  );
}