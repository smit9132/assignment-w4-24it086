// controllers/taskController.js

const Task = require("../models/Task");
const { addLinksToTask, addLinksToTasks } = require("../utils/hateoas");
const { cache, stats } = require("../cache");
const taskEvents = require("../events");

const ALL_TASKS_KEY = "all_tasks";
const getTaskCacheKey = (taskId) => `task_${taskId}`;

// Get all tasks
const getTasks = async (req, res, next) => {
    try {
        const cachedTasks = cache.get(ALL_TASKS_KEY);
        if (cachedTasks) {
            stats.allTasks.hits += 1;
            return res.status(200).json(cachedTasks);
        }

        stats.allTasks.misses += 1;
        const tasks = await Task.find();
        const tasksWithLinks = addLinksToTasks(tasks);

        const response = {
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
        };

        cache.set(ALL_TASKS_KEY, response);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};


// Get a single task by ID
const getTaskById = async (req, res, next) => {
    try {
        const taskCacheKey = getTaskCacheKey(req.params.id);
        const cachedTask = cache.get(taskCacheKey);
        if (cachedTask) {
            stats.taskById.hits += 1;
            return res.status(200).json(cachedTask);
        }

        stats.taskById.misses += 1;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const taskWithLinks = addLinksToTask(task);

        const response = {
            success: true,
            data: taskWithLinks
        };

        cache.set(taskCacheKey, response);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};


// Create a new task
const createTask = async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        const taskWithLinks = addLinksToTask(task);
        cache.del(ALL_TASKS_KEY);

        res.status(201).json({
            success: true,
            data: taskWithLinks
        });

        console.log("[API] Task created");
        console.log(`[API] Response sent at: ${new Date().toISOString()}`);
        taskEvents.emit("task-created", { task, userId: req.user?.id });
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
        cache.del(ALL_TASKS_KEY);
        cache.del(getTaskCacheKey(req.params.id));

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
        cache.del(ALL_TASKS_KEY);
        cache.del(getTaskCacheKey(req.params.id));

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

        cache.del(ALL_TASKS_KEY);
        cache.del(getTaskCacheKey(req.params.id));

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

        console.log("[API] Task deleted");
        taskEvents.emit("task-deleted", { task, userId: req.user?.id });
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