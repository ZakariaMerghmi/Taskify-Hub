import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "./contextAPI";
import { faSearch,faBarsProgress, faLayerGroup, faTasks, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";

interface SearchResult {
  id: string;
  title: string;
  type: 'project' | 'category' | 'task';
  subtitle?: string;
 
}

export default function SearchBar() {
  const { isdark, projects, CategoryData } = useGlobalContext();
  const { categories } = CategoryData;
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search in projects
    projects.forEach(project => {
      if (project.name.toLowerCase().includes(query)) {
        results.push({
          id: project.id,
          title: project.name,
          type: 'project',
          subtitle: `Category: ${project.category}`,
          
        });
      }
    });

   
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query)) {
        results.push({
          id: category.id,
          title: category.name,
          type: 'category',
          subtitle: 'Category',
          
        });
      }
    });

    setSearchResults(results);
    setShowResults(results.length > 0);
  }, [searchQuery, projects, categories]);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Selected:', result);
   
    switch (result.type) {
      case 'project':
      
        console.log('Opening project:', result.title);
        break;
      case 'category':
       
        console.log('Opening category:', result.title);
        break;
      case 'task':
       
        console.log('Opening task:', result.title);
        break;
    }
    setShowResults(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false);
      setSearchQuery("");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'text-blue-500';
      case 'category':
        return 'text-green-500';
      case 'task':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project':
        return 'Project';
      case 'category':
        return 'Category';
      case 'task':
        return 'Task';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-1/3" ref={searchContainerRef}>
      <div className={`flex gap-2 items-center border p-3 rounded-md transition-all duration-200 ${
        showResults ? 'rounded-b-none border-b-0' : ''
      } ${isdark ? 'border-gray-600 bg-blue-900' : 'border-gray-300 bg-white'}`}>
        <FontAwesomeIcon
          height={20}
          width={20}
          className={`cursor-pointer ${isdark ? "text-white" : "text-gray-500"}`}
          icon={faSearch}
        />
        <input
          className={`outline-none text-[14px] font-light w-full ${
            isdark ? "text-white bg-transparent placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
          }`}
          placeholder="Search projects, categories..."
          ref={inputRef}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {searchQuery && (
          <span className="text-xs text-gray-400">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

     
      {showResults && (
        <div className={`absolute top-full left-0 right-0 z-50 border border-t-0 rounded-b-md shadow-lg max-h-60 overflow-y-auto ${
          isdark ? 'bg-blue-900 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          {searchResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:${
                isdark ? 'bg-blue-800' : 'bg-gray-50'
              } border-b last:border-b-0 ${
                isdark ? 'border-gray-700' : 'border-gray-200'
              }`}
              onClick={() => handleResultClick(result)}
            >
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    isdark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {result.title}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isdark ? 'bg-blue-800 text-blue-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getTypeLabel(result.type)}
                  </span>
                </div>
                {result.subtitle && (
                  <span className={`text-xs ${
                    isdark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {result.subtitle}
                  </span>
                )}
              </div>
              <FontAwesomeIcon
                icon={faArrowRight}
                className={`w-3 h-3 ${isdark ? 'text-gray-400' : 'text-gray-400'}`}
              />
            </div>
          ))}
          
          {searchQuery && searchResults.length === 0 && (
            <div className={`p-4 text-center ${
              isdark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <FontAwesomeIcon icon={faSearch} className="mb-2" />
              <div>No results found for "{searchQuery}"</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}