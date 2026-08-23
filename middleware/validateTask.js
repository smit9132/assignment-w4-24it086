const validateTask = (req, res, next) => {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
        return res.status(400).json({ success: false, message: "Title is required" });
    }
    next();
};

module.exports = validateTask;