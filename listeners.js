const taskEvents = require("./events");

taskEvents.on("task-created", ({ task, userId }) => {
    const createdAt = task.createdAt
        ? new Date(task.createdAt).toISOString()
        : new Date().toISOString();
    const assignedUser = userId || task.assignedUser || "not available";

    console.log(`[Notification] task-created received at: ${new Date().toISOString()}`);
    console.log(`[Notification] Handler started at: ${new Date().toISOString()}`);
    console.log(`[Notification] Task "${task.title}" created at ${createdAt}`);
    console.log(`[Notification] Assigned user: ${assignedUser}`);

    setTimeout(() => {
        console.log(`[Notification] Notification completed at: ${new Date().toISOString()}`);
    }, 2000);
});

taskEvents.on("task-deleted", ({ task, userId }) => {
    console.log(`[Event] task-deleted received at: ${new Date().toISOString()}`);
    console.log(`[Notification] Deleted task: "${task.title}" (${task._id})`);
    console.log(`[Notification] Deleted by user: ${userId || "not available"}`);
});

taskEvents.on("error", (error) => {
    console.error("[EventEmitter] Custom event error:", error);
});