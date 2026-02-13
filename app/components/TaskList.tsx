"use client";

import { useState } from "react";
import "./TaskList.css";
import { apiFetch } from "../lib/api";
import LogoutButton from "./LogoutButton";
import { formatDateForInput } from "./formatDate";
import {useToast} from "../hooks/toast";

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


  const { toast, showToast } = useToast();
  // CREATE TASK
  const handleCreate = async () => {
    if (!title || !description || !dueDate) {
      showToast("Please fill in all required fields","error");
      return;
    }

    const payload: any = {
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(), 
      status: status || "Pending",
      priority: priority || undefined 
    };


    const res = await fetch("/api/v1/tasks/create-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if(!res.ok) {
      showToast(data.message || "could not create task!", "error");
      
      return;
    }

    showToast(data.message || "Task created successfully!", "success");
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

    // Send fields even if empty (so backend can process them)
    payload.title = editTitle.trim();
    payload.description = editDescription.trim();
    payload.status = editStatus;
    payload.priority = editPriority;

    // Only send Date if it is valid
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

    const data = await res.json()
    if (!res.ok) {
      
      showToast(data.message || "could not update!","error")
      
      return;
    }

    showToast(data.message || "task updated successfully!", "success");

    setEditingTaskId(null);
    refreshTasks();
  };


  const handleDelete = async (taskId: string) => {
    const res =await fetch(`/api/v1/tasks/delete-task/${taskId}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json()
    if (!res.ok) {
      showToast(data.message || "could not delete!","error")
      return;
    }

    showToast(data.message || "task deleted successfully!", "success");
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
      

      {toast.visible && (
        <div className={`toast-notification toast-${toast.type}`}>
           <span>{toast.message}</span>
        </div>
      )}

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
              type={dueDate ? "datetime-local" : "text"}
              placeholder="Due Date *"
              value={dueDate}
              onFocus={(e) => (e.target.type = "datetime-local")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <select value={status} aria-placeholder="Status" onChange={(e) => setStatus(e.target.value)}>
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

      <h2 className="page-title">Your Tasks</h2>

      <button
        className="add-task-btn"
        onClick={() => setShowCreateModal(true)}
      >
        +
      </button>

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
                    setEditDueDate(formatDateForInput(task.dueDate));
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
