import { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../../api";
import Toast from "../Toast";
import "./Projects.css";

function Projects() {
  const emptyForm = { title: "", description: "", completed: false, priority: "medium" };
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [operation, setOperation] = useState(null);
  const [notice, setNotice] = useState({ message: "", type: "success" });

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice({ message: "", type: "success" }), 3500);
  };

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await getTasks());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        setTasks(await getTasks());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialTasks();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      showNotice("A task title is required.", "error");
      return;
    }

    setOperation(editingId ? `update-${editingId}` : "create");
    setError(null);
    try {
      if (editingId) {
        const updatedTask = await updateTask(editingId, formData);
        setTasks((current) => current.map((task) => task._id === editingId ? updatedTask : task));
        showNotice("Task updated successfully!");
      } else {
        const newTask = await createTask(formData);
        setTasks((current) => [newTask, ...current]);
        showNotice("Task created successfully!");
      }
      setFormData(emptyForm);
      setEditingId(null);
    } catch (requestError) {
      showNotice(requestError.message, "error");
    } finally {
      setOperation(null);
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      completed: Boolean(task.completed),
      priority: task.priority || "medium",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setOperation(`delete-${id}`);
    setError(null);
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
      showNotice("Task deleted successfully!");
    } catch (requestError) {
      showNotice(requestError.message, "error");
    } finally {
      setOperation(null);
    }
  };

  return (
    <section className="projects" id="projects">
      <Toast message={notice.message} type={notice.type} />
      <div className="projects-heading">
        <p className="eyebrow">A practical build · React + API</p>
        <h1>Task Manager</h1>
        <p>
          A simple place to capture what needs doing. Add a task, set its
          priority, and keep it moving.
        </p>
      </div>

      <div className="task-workspace">
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="task-form-heading">
            <span className="form-step">{editingId ? "02" : "01"}</span>
            <div>
              <h2>{editingId ? "Edit your task" : "Add a new task"}</h2>
              <p>Keep it short and easy to act on.</p>
            </div>
          </div>
          <label htmlFor="task-title">Task title</label>
          <input id="task-title" name="title" value={formData.title} onChange={handleChange} placeholder="What needs to get done?" required maxLength={120} />
          <label htmlFor="task-description">A few details <span>(optional)</span></label>
          <textarea id="task-description" name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Add a note or helpful context..." maxLength={1000} />
          <div className="task-form-row">
            <label htmlFor="task-priority">Priority
              <select id="task-priority" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </label>
            <label className="checkbox-label"><input type="checkbox" name="completed" checked={formData.completed} onChange={handleChange} /> Mark complete</label>
          </div>
          <div className="form-actions">
            <button className="task-submit" type="submit" disabled={Boolean(operation)}>
              {operation === "create" ? "Adding task..." : editingId ? (operation ? "Saving..." : "Save changes") : "Add task"}
              {!operation && <span aria-hidden="true">↗</span>}
            </button>
            {editingId && <button type="button" className="button-secondary" onClick={cancelEditing} disabled={Boolean(operation)}>Cancel</button>}
          </div>
        </form>

        <div className="task-list" aria-live="polite">
          <div className="task-list-header">
            <div><p className="section-kicker">Your list</p><h2>Tasks in motion</h2></div>
            <button type="button" className="refresh-button" onClick={loadTasks} disabled={loading || Boolean(operation)} aria-label="Refresh tasks">↻</button>
          </div>
          {loading && <p className="task-message" role="status">Loading your tasks...</p>}
          {!loading && error && <div className="task-message error-message"><p>Couldn’t load tasks: {error}</p><button type="button" className="button-secondary" onClick={loadTasks}>Try again</button></div>}
          {!loading && !error && tasks.length === 0 && (
            <div className="task-empty">
              <span aria-hidden="true">✳</span>
              <h3>A fresh start.</h3>
              <p>No tasks yet. Add the first one and give it a priority.</p>
            </div>
          )}
          {!loading && !error && tasks.map((task) => (
            <article className={`task-card${task.completed ? " is-complete" : ""}`} key={task._id}>
              <div className="task-card-content">
                <div className="task-card-title"><h3>{task.title}</h3><span className={`priority priority-${task.priority}`}>{task.priority}</span></div>
                <p>{task.description || "No extra details"}</p>
                <small><span className={`task-state${task.completed ? " complete" : ""}`} />{task.completed ? "Completed" : "In progress"} <span aria-hidden="true">·</span> {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Date unavailable"}</small>
              </div>
              <div className="task-actions">
                <button type="button" className="edit-task" onClick={() => startEditing(task)} disabled={Boolean(operation)}>Edit</button>
                <button type="button" className="delete-task" onClick={() => handleDelete(task._id)} disabled={operation === `delete-${task._id}`}>{operation === `delete-${task._id}` ? "Deleting..." : "Delete"}</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
