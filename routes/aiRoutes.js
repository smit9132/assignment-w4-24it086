// routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const { aiRateLimiter } = require("../middleware/aiRateLimiter");
const { generateDescription } = require("../controllers/aiController");

// POST /api/ai/generate-description
router.post("/generate-description", aiRateLimiter, generateDescription);

module.exports = router;

