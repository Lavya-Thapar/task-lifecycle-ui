"use client";

import { useEffect, useState } from "react";
import TaskList from "@/app/components/TaskList";
import { apiFetch } from "../../lib/api";
import "../../components/TaskList.css";


export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  const filteredTasks = tasks.filter((task) => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="loader">Loading Tasks...</div>;

  return (
    <div className="tasks-page-container">
      
      <div className="search-bar-container">
        <input 
          type="text" 
          placeholder="Search by title or description..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <TaskList tasks={filteredTasks} refreshTasks={fetchTasks} />
      
      {filteredTasks.length === 0 && searchQuery && (
        <p className="no-results">No tasks found matching "{searchQuery}"</p>
      )}

    </div>
  );
}

