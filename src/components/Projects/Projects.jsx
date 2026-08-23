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
        <p className="eyebrow">Practical 6</p>
        <h2>Task Management</h2>
        <p>Tasks are loaded from the Express API and persisted in MongoDB Atlas.</p>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Update task" : "Create a task"}</h3>
        <label>Title<input name="title" value={formData.title} onChange={handleChange} required /></label>
        <label>Description<textarea name="description" value={formData.description} onChange={handleChange} rows="3" /></label>
        <div className="task-form-row">
          <label>Priority<select name="priority" value={formData.priority} onChange={handleChange}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          <label className="checkbox-label"><input type="checkbox" name="completed" checked={formData.completed} onChange={handleChange} /> Completed</label>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={Boolean(operation)}>{operation === "create" ? "Creating..." : editingId ? (operation ? "Updating..." : "Update task") : "Create task"}</button>
          {editingId && <button type="button" className="button-secondary" onClick={cancelEditing} disabled={Boolean(operation)}>Cancel</button>}
        </div>
      </form>

      <div className="task-list" aria-live="polite">
        <div className="task-list-header"><h3>Saved tasks</h3><button type="button" className="button-secondary" onClick={loadTasks} disabled={loading || Boolean(operation)}>Refresh</button></div>
        {loading && <p className="task-message">Loading tasks...</p>}
        {!loading && error && <div className="task-message error-message"><p>Unable to load tasks: {error}</p><button type="button" onClick={loadTasks}>Try again</button></div>}
        {!loading && !error && tasks.length === 0 && <p className="task-message">No tasks yet. Create the first one above.</p>}
        {!loading && !error && tasks.map((task) => (
          <article className="task-card" key={task._id}>
            <div><div className="task-card-title"><h4>{task.title}</h4><span className={`priority priority-${task.priority}`}>{task.priority}</span></div><p>{task.description || "No description"}</p><small>{task.completed ? "Completed" : "In progress"} | {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Date unavailable"}</small></div>
            <div className="task-actions"><button type="button" onClick={() => startEditing(task)} disabled={Boolean(operation)}>Edit</button><button type="button" className="button-danger" onClick={() => handleDelete(task._id)} disabled={operation === `delete-${task._id}`}>{operation === `delete-${task._id}` ? "Deleting..." : "Delete"}</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
