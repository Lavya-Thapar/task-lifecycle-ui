"use client";

import { useState } from "react";
import "./TaskList.css";
import { apiFetch } from "../lib/api";
import LogoutButton from "./LogoutButton";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
};

type TaskListProps = {
  tasks: Task[];
  refreshTasks: () => void;
};

export default function TaskList({ tasks, refreshTasks }: TaskListProps) {
  // CREATE form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  // UPDATE form state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // CREATE TASK
  const handleCreate = async () => {
    if (!title || !description || !dueDate) return;

    const payload: any = {
      title,
      description,
      dueDate: new Date(dueDate).toISOString()
    };

    if (status) payload.status = status;
    if (priority) payload.priority = priority;

    await fetch("/api/v1/tasks/create-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    // reset form
    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("");
    setPriority("");

    refreshTasks();
  };

  const handleUpdate = async () => {
    if (!editingTaskId) return;

    const payload: any = {};

    // 1. Send fields even if empty (so backend can process them)
    payload.title = editTitle.trim();
    payload.description = editDescription.trim();
    payload.status = editStatus;
    payload.priority = editPriority;

    // 2. Only send Date if it is valid
    if (editDueDate) {
      payload.dueDate = new Date(editDueDate).toISOString();
    }

    const res = await fetch(
      `/api/v1/tasks/update-task/${editingTaskId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      }
    );

    
    if (!res.ok) {
      
      alert("could not update!")
      
      return;
    }

    setEditingTaskId(null);
    refreshTasks();
  };


  const handleDelete = async (taskId: string) => {
    await fetch(`/api/v1/tasks/delete-task/${taskId}`, {
      method: "DELETE",
      credentials: "include"
    });

    refreshTasks();
  };

  const isOverdue = (task: Task) => {
    return (
      new Date(task.dueDate).getTime() < Date.now() &&
      task.status !== "Completed"
    );
  };

  const getPriorityClass = (priority: string) => {
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  };

  const getStatusClass = (task: Task) => {
    if (isOverdue(task)) return "status-overdue";
    if (task.status === "Completed") return "status-completed";
    if (task.status === "In progress") return "status-progress";
    return "status-pending";
  };

  return (
    <div>
      <button
        className="add-task-btn"
        onClick={() => setShowCreateModal(true)}
      >
        +
      </button>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Task</h2>

            <input
              placeholder="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Status (optional)</option>
              <option value="Pending">Pending</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">Priority (optional)</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={() => {
                  handleCreate();
                  setShowCreateModal(false);
                }}
              >
                Create
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Task</h2>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <input
              type="datetime-local"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />

            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="">Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={async () => {
                  await handleUpdate();
                  setShowEditModal(false);
                }}
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTaskId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      <hr />
      <LogoutButton />

      <h2 className="page-title">Your Tasks</h2>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks yet</h3>
          <p>Create your first task by clicking the + button</p>
        </div>
      ) : (
          <div className="task-grid">
            {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>

                <div className="badge-group">
                  {isOverdue(task) && <span className="badge overdue">Overdue</span>}

                  <span className={`badge ${getStatusClass(task)}`}>
                    {task.status}
                  </span>

                  <span className={`badge ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <p className="task-description">{task.description}</p>

              <div className="task-info">
                <span>Status: {task.status}</span>
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>

              <div className="task-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingTaskId(task._id);
                    setEditTitle(task.title);
                    setEditDescription(task.description);
                    setEditDueDate(task.dueDate.slice(0, 16));
                    setEditStatus(task.status);
                    setEditPriority(task.priority);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            ))}
          </div>
      )}
      
      
         
    </div>
  );
}
