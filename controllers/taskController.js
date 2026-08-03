// controllers/taskController.js

const tasks = require('../data/tasks');

// Get all tasks
const getTasks = (req, res) => {
  res.status(200).json(tasks);
};

// Create a new task
const createTask = (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

// Update a task by id
const updateTask = (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { title, completed } = req.body;

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.status(200).json(task);
};

// Delete a task by id
const deleteTask = (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: 'Task deleted successfully' });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
