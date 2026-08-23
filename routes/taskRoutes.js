const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateTask = require("../middleware/validateTask");

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    partialUpdateTask,
    deleteTask
} = require("../controllers/taskController");


// GET all tasks
router.get("/tasks", authMiddleware, getTasks);


// GET single task
router.get("/tasks/:id", authMiddleware, getTaskById);


// CREATE task
router.post("/tasks", authMiddleware, validateTask, createTask);


// UPDATE task (PUT - full update)
router.put("/tasks/:id", authMiddleware, updateTask);


// PATCH task (partial update)
router.patch("/tasks/:id", authMiddleware, partialUpdateTask);


// DELETE task
router.delete("/tasks/:id", authMiddleware, deleteTask);


module.exports = router;