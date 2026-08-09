const express = require("express");

const router = express.Router();

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");


// GET all tasks
router.get("/tasks", getTasks);


// GET single task
router.get("/tasks/:id", getTaskById);


// CREATE task
router.post("/tasks", createTask);


// UPDATE task
router.put("/tasks/:id", updateTask);


// DELETE task
router.delete("/tasks/:id", deleteTask);


module.exports = router;