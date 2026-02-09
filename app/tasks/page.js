"use client";

import { useEffect, useState } from "react";
import TaskList from "@/app/components/TaskList";
import { apiFetch } from "../lib/api";


export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await apiFetch("/users/get-tasks", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();
    setTasks(Array.isArray(data.data) ? data.data : []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return <TaskList tasks={tasks} refreshTasks={fetchTasks} />;
}

