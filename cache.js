const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60 });

const stats = {
    allTasks: { hits: 0, misses: 0 },
    taskById: { hits: 0, misses: 0 }
};

const getCacheStats = () => ({
    ttlSeconds: 60,
    allTasks: { ...stats.allTasks },
    taskById: { ...stats.taskById },
    totalKeys: cache.keys().length
});

module.exports = {
    cache,
    stats,
    getCacheStats
};