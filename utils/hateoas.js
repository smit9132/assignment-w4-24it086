// utils/hateoas.js
// Helper functions to add HATEOAS (Hypermedia As The Engine Of Application State) links to API responses.
// This implements Richardson Maturity Model Level 3.

/**
 * Add HATEOAS links to a single task.
 * @param {Object} task - The task object (Mongoose document)
 * @returns {Object} Task object with _links property
 */
const addLinksToTask = (task) => {
    const taskObj = task.toObject ? task.toObject() : task;
    const taskId = taskObj._id.toString();

    taskObj._links = {
        self: {
            href: `/tasks/${taskId}`,
            method: "GET"
        },
        update: {
            href: `/tasks/${taskId}`,
            method: "PUT"
        },
        partialUpdate: {
            href: `/tasks/${taskId}`,
            method: "PATCH"
        },
        delete: {
            href: `/tasks/${taskId}`,
            method: "DELETE"
        },
        collection: {
            href: "/tasks",
            method: "GET"
        }
    };

    return taskObj;
};

/**
 * Add HATEOAS links to an array of tasks.
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Array of tasks with _links properties
 */
const addLinksToTasks = (tasks) => {
    return tasks.map(task => addLinksToTask(task));
};

module.exports = {
    addLinksToTask,
    addLinksToTasks
};
