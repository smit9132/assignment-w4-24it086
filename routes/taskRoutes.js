// routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /tasks - retrieve all tasks
router.get('/tasks', taskController.getTasks);

// POST /tasks - create a new task
router.post('/tasks', taskController.createTask);

// PUT /tasks/:id - update a task by id
router.put('/tasks/:id', taskController.updateTask);

// DELETE /tasks/:id - delete a task by id
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
