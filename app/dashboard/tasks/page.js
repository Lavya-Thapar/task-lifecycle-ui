"use client";

import { useEffect, useState } from "react";
import TaskList from "@/app/components/TaskList";
import { apiFetch } from "../../lib/api";
import "../../components/TaskList.css";


export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filters, setFilters] = useState({
  status: [], 
  priority: [], 
  });

  const fetchTasks = async () => {
    try{
      setLoading(true);
      const res = await fetch("/api/v1/users/get-tasks", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      if(res.ok){
        setTasks(Array.isArray(data.data) ? data.data : []);
      }

      }
      catch(error){
        console.error(error)
      }
      finally{
        setLoading(false)
      }
    
  };

  useEffect(() => {
    fetchTasks();
  }, []);

   const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const currentList = prev[category];
      if (currentList.includes(value)) {
        // Remove if already selected
        return { ...prev, [category]: currentList.filter((item) => item !== value) };
      } else {
        // Add if not selected
        return { ...prev, [category]: [...currentList, value] };
      }
    });
  };


  // Inside your component
  const filteredTasks = tasks.filter((task) => {
    // Text Search 
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status Filter
    // If status array is empty, show ALL. If not, task.status MUST be in the array.
    const matchesStatus = filters.status.length === 0 || filters.status.includes(task.status);

    // Priority Filter
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(task.priority);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) return <div className="loader">Loading Tasks...</div>;

  return (
    <div className="tasks-page-container">
      
      <div className="search-bar-and-filter-container">
        <input 
          type="text" 
          placeholder="Search by title or description..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="filter-container" style={{ position: "relative" }}>
          <button 
            className="filter-btn"
            onClick={() => setShowFilterPopup(!showFilterPopup)}
          >
            Filter
          </button>

          {/* --- POPUP BOX --- */}
          {showFilterPopup && (
            <div className="filter-popup">
              
              {/* STATUS SECTION */}
              <div className="filter-section">
                <h4>Status</h4>
                <label>
                  <input 
                    type="checkbox" 
                    checked={filters.status.includes("Pending")}
                    onChange={() => handleFilterChange("status", "Pending")}
                  /> Pending
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={filters.status.includes("In progress")}
                    onChange={() => handleFilterChange("status", "In progress")}
                  /> In Progress
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={filters.status.includes("Completed")}
                    onChange={() => handleFilterChange("status", "Completed")}
                  /> Completed
                </label>
              </div>

              <hr />

              {/* PRIORITY SECTION */}
              <div className="filter-section">
                <h4>Priority</h4>
                <label>
                  <input 
                    type="checkbox" 
                    checked={filters.priority.includes("Low")}
                    onChange={() => handleFilterChange("priority", "Low")}
                  /> Low
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={filters.priority.includes("Medium")}
                    onChange={() => handleFilterChange("priority", "Medium")}
                  /> Medium
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={filters.priority.includes("High")}
                    onChange={() => handleFilterChange("priority", "High")}
                  /> High
                </label>
              </div>
              
              {/* CLEAR FILTERS BUTTON */}
              {(filters.status.length > 0 || filters.priority.length > 0) && (
                <button 
                  className="clear-filters-btn"
                  onClick={() => setFilters({ status: [], priority: [] })}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
        
      </div>

      

      <TaskList tasks={filteredTasks} refreshTasks={fetchTasks} />
      
      {filteredTasks.length === 0 && searchQuery && (
        <p className="no-results">No tasks found matching "{searchQuery}"</p>
      )}

    </div>
  );
}

