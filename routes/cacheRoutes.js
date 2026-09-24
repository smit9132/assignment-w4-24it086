const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getCacheStats } = require("../cache");

const router = express.Router();

router.get("/api/cache/stats", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        data: getCacheStats()
    });
});

module.exports = router;