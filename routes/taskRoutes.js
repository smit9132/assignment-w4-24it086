const express = require("express");

const router = express.Router();

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    partialUpdateTask,
    deleteTask
} = require("../controllers/taskController");


// GET all tasks
router.get("/tasks", getTasks);


// GET single task
router.get("/tasks/:id", getTaskById);


// CREATE task
router.post("/tasks", createTask);


// UPDATE task (PUT - full update)
router.put("/tasks/:id", updateTask);


// PATCH task (partial update)
router.patch("/tasks/:id", partialUpdateTask);


// DELETE task
router.delete("/tasks/:id", deleteTask);


module.exports = router;