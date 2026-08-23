// controllers/taskController.js

const Task = require("../models/Task");
const { addLinksToTask, addLinksToTasks } = require("../utils/hateoas");

// Get all tasks
const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find();
        const tasksWithLinks = addLinksToTasks(tasks);

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasksWithLinks,
            _links: {
                self: {
                    href: "/tasks",
                    method: "GET"
                },
                create: {
                    href: "/tasks",
                    method: "POST"
                }
            }
        });
    } catch (error) {
        next(error);
    }
};


// Get a single task by ID
const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const taskWithLinks = addLinksToTask(task);

        res.status(200).json({
            success: true,
            data: taskWithLinks
        });
    } catch (error) {
        next(error);
    }
};


// Create a new task
const createTask = async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        const taskWithLinks = addLinksToTask(task);

        res.status(201).json({
            success: true,
            data: taskWithLinks
        });
    } catch (error) {
        next(error);
    }
};


// Update a task (PUT - full update)
const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const taskWithLinks = addLinksToTask(task);

        res.status(200).json({
            success: true,
            data: taskWithLinks
        });
    } catch (error) {
        next(error);
    }
};

// Partial update a task (PATCH - partial update)
// PATCH allows updating only specific fields without requiring all fields
const partialUpdateTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const taskWithLinks = addLinksToTask(task);

        res.status(200).json({
            success: true,
            data: taskWithLinks
        });
    } catch (error) {
        next(error);
    }
};


// Delete a task
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            _links: {
                collection: {
                    href: "/tasks",
                    method: "GET"
                }
            }
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    partialUpdateTask,
    deleteTask
};