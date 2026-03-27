import React, { useState } from "react";
import Task from "../reusable/TaskInterface";



function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    status: "Pending",
  });
  const [loadFormData, setLoadFormData] = useState(false);

  // Fetch all tasks
  const fetchTasks = () => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:8080/api/tasks")
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch tasks");
        return response.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new task
  const handleAddTask = () => {
    setLoadFormData(true);
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to add task");
        return response.json();
      })
      .then(newTask => {
        setTasks([...tasks, newTask]);
        setFormData({ title: "", description: "", status: "Pending" });
        setError(null);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error adding task:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  // Start editing a task
  const handleEditStart = (task: Task) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  // Update task
  const handleUpdateTask = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8080/api/tasks/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to update task");
        return response.json();
      })
      .then(updatedTask => {
        setTasks(tasks.map(task => (task.id === editingId ? updatedTask : task)));
        setEditingId(null);
        setFormData({ title: "", description: "", status: "Pending" });
        setError(null);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error updating task:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  // Delete task
  const handleDeleteTask = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to delete task");
        setTasks(tasks.filter(task => task.id !== id));
        setError(null);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error deleting task:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", status: "Pending" });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>Task Management</h2>

      {error && <p style={{ color: "red", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "4px" }}>❌ {error}</p>}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={fetchTasks}
          disabled={loading}
          style={{ padding: "10px 20px", backgroundColor: "#FF9800", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {loading ? "Loading..." : "Refresh Tasks"}
        </button>
        {editingId ? (
          <>
            <button
              onClick={handleUpdateTask}
              disabled={loading}
              style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              {loading ? "Updating..." : "Update Task"}
            </button>
            <button
              onClick={handleCancel}
              style={{ padding: "10px 20px", backgroundColor: "#666", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
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
            {loading ? "Adding..." : "Add Task"}
          </button>
        )}
      </div>

      {/* Form Section */}

      {loadFormData && (<div style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "2rem", borderRadius: "4px", backgroundColor: "#f9f9f9" }}>
        <h3>{editingId ? "Edit Task" : "Add New Task"}</h3>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task title"
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter task description"
            rows={3}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
          >
            <option value="TODO">TO DO</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Completed</option>
          </select>
        </div>


      </div>)}

      {/* Table Section */}
      {tasks.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th style={{ textAlign: "left" }}>ID</th>
              <th style={{ textAlign: "left" }}>Title</th>
              <th style={{ textAlign: "left" }}>Description</th>
              <th style={{ textAlign: "left" }}>Status</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      backgroundColor: task.status === "Completed" ? "#4CAF50" : task.status === "In Progress" ? "#FF9800" : "#2196F3",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {task.status}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => handleEditStart(task)}
                    style={{ padding: "5px 10px", marginRight: "5px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ padding: "5px 10px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#999" }}>No tasks yet. Click "Refresh Tasks" or "Add Task" to get started.</p>
      )}
    </div>
  );
}

export default TaskTable;