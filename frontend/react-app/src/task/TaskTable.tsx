import React, { useState, useEffect } from "react";
import Task from "../reusable/TaskInterface";
 
const TITLE_MAX = 100;
const DESC_MAX = 500;
 
const STATUS_LABELS: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Completed",
};
 
const STATUS_COLORS: Record<string, string> = {
  TODO: "#2196F3",
  IN_PROGRESS: "#FF9800",
  DONE: "#4CAF50",
};
 
function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    status: "TODO",
  });
  const [validationErrors, setValidationErrors] = useState<{ title?: string; description?: string }>({});
 
  // Fetch all tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);
 
  const fetchTasks = () => {
    setLoading(true);
    setError(null);
 
    fetch("http://localhost:8080/api/tasks")
      .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(`Could not load tasks. ${err.message}. Please check your connection and try again.`);
        setLoading(false);
      });
  };
 
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error on change
    setValidationErrors(prev => ({ ...prev, [name]: undefined }));
  };
 
  const validate = (): boolean => {
    const errors: { title?: string; description?: string } = {};
 
    if (!formData.title.trim()) {
      errors.title = "Title is required.";
    } else if (formData.title.length > TITLE_MAX) {
      errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
    }
 
    if (formData.description.length > DESC_MAX) {
      errors.description = `Description must be ${DESC_MAX} characters or fewer.`;
    }
 
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
 
  const resetForm = () => {
    setFormData({ title: "", description: "", status: "TODO" });
    setValidationErrors({});
    setEditingId(null);
  };
 
  const handleAddTask = () => {
    if (!validate()) return;
 
    setLoading(true);
    setError(null);
    fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then(newTask => {
        setTasks(prev => [...prev, newTask]);
        resetForm();
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to add task. ${err.message}`);
        setLoading(false);
      });
  };
 
  const handleEditStart = (task: Task) => {
    setEditingId(task.id);
    setFormData({ title: task.title, description: task.description, status: task.status });
    setValidationErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  const handleUpdateTask = () => {
    if (!validate()) return;
 
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/tasks/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then(updatedTask => {
        setTasks(prev => prev.map(t => (t.id === editingId ? updatedTask : t)));
        resetForm();
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to update task. ${err.message}`);
        setLoading(false);
      });
  };
 
  const handleDeleteTask = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
 
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/tasks/${id}`, { method: "DELETE" })
      .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
        setTasks(prev => prev.filter(t => t.id !== id));
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to delete task. ${err.message}`);
        setLoading(false);
      });
  };
 
  const handleStatusChange = (task: Task, newStatus: string) => {
    fetch(`http://localhost:8080/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status: newStatus }),
    })
      .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then(updatedTask => {
        setTasks(prev => prev.map(t => (t.id === task.id ? updatedTask : t)));
      })
      .catch(err => {
        setError(`Failed to update status. ${err.message}`);
      });
  };
 
  const handleCancel = () => resetForm();
 
  const isEditing = editingId !== null;
 
  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Task Management</h2>
 
      {/* Global error banner */}
      {error && (
        <div
          role="alert"
          style={{
            color: "#b71c1c",
            padding: "12px 16px",
            backgroundColor: "#ffebee",
            border: "1px solid #ef9a9a",
            borderRadius: "4px",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>❌ {error}</span>
          <button
            onClick={() => setError(null)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#b71c1c" }}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
 
      {/* Form Section — always visible */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "1.5rem",
          marginBottom: "2rem",
          borderRadius: "6px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{isEditing ? "Edit Task" : "Add New Task"}</h3>
 
        {/* Title */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "bold" }}>
            Title <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task title"
            maxLength={TITLE_MAX}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: `1px solid ${validationErrors.title ? "#e53935" : "#ccc"}`,
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            {validationErrors.title ? (
              <span style={{ color: "#e53935", fontSize: "13px" }}>⚠ {validationErrors.title}</span>
            ) : (
              <span />
            )}
            <span style={{ fontSize: "12px", color: "#999" }}>
              {formData.title.length}/{TITLE_MAX}
            </span>
          </div>
        </div>
 
        {/* Description */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "bold" }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter task description"
            rows={3}
            maxLength={DESC_MAX}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: `1px solid ${validationErrors.description ? "#e53935" : "#ccc"}`,
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            {validationErrors.description ? (
              <span style={{ color: "#e53935", fontSize: "13px" }}>⚠ {validationErrors.description}</span>
            ) : (
              <span />
            )}
            <span style={{ fontSize: "12px", color: "#999" }}>
              {formData.description.length}/{DESC_MAX}
            </span>
          </div>
        </div>
 
        {/* Status */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "bold" }}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
 
        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {isEditing ? (
            <>
              <button
                onClick={handleUpdateTask}
                disabled={loading}
                style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                {loading ? "Updating…" : "Update Task"}
              </button>
              <button
                onClick={handleCancel}
                style={{ padding: "10px 20px", backgroundColor: "#757575", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAddTask}
              disabled={loading}
              style={{ padding: "10px 20px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              {loading ? "Adding…" : "Add Task"}
            </button>
          )}
          <button
            onClick={fetchTasks}
            disabled={loading}
            style={{ padding: "10px 20px", backgroundColor: "#FF9800", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginLeft: "auto" }}
          >
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>
      </div>
 
      {/* Task Table */}
      {loading && tasks.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999" }}>Loading tasks…</p>
      ) : tasks.length > 0 ? (
        <table
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}
        >
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>ID</th>
              <th style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>Title</th>
              <th style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>Description</th>
              <th style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>Status</th>
              <th style={{ textAlign: "center", borderBottom: "2px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ color: "#999", fontSize: "13px" }}>{task.id}</td>
                <td style={{ fontWeight: 500 }}>{task.title}</td>
                <td style={{ color: "#555" }}>{task.description || <em style={{ color: "#bbb" }}>—</em>}</td>
                <td>
                  {/* Inline status dropdown */}
                  <select
                    value={task.status}
                    onChange={e => handleStatusChange(task, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: STATUS_COLORS[task.status] ?? "#ccc",
                      color: "white",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value} style={{ backgroundColor: "#fff", color: "#333" }}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => handleEditStart(task)}
                    style={{ padding: "5px 12px", marginRight: "6px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ padding: "5px 12px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#999", padding: "2rem 0" }}>
          No tasks yet. Use the form above to add your first task.
        </p>
      )}
    </div>
  );
}
 
export default TaskTable;