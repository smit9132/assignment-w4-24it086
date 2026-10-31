// middleware/aiRateLimiter.js

// In-memory store for rate limiting AI generation requests: key -> timestamp (ms)
const requestHistory = new Map();

// Maximum 1 request per task per minute (60,000 milliseconds)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

const aiRateLimiter = (req, res, next) => {
  const title = (req.body && typeof req.body.title === "string") ? req.body.title.trim().toLowerCase() : "";

  // If no title is supplied, continue to validation in controller (which returns 400 Bad Request)
  if (!title) {
    return next();
  }

  const clientIp = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "global-client";
  const rateLimitKey = `${clientIp}:${title}`;
  const now = Date.now();
  const lastRequestTime = requestHistory.get(rateLimitKey);

  if (lastRequestTime && (now - lastRequestTime) < RATE_LIMIT_WINDOW_MS) {
    const remainingSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequestTime)) / 1000);
    return res.status(429).json({
      success: false,
      message: `Rate limit reached. Maximum one AI generation request per task per minute. Please wait ${remainingSeconds} second(s) before trying again.`,
      retryAfter: remainingSeconds
    });
  }

  // Record this request timestamp
  requestHistory.set(rateLimitKey, now);

  // Clean up older records periodically to prevent memory leaks
  if (requestHistory.size > 500) {
    for (const [entryKey, timestamp] of requestHistory.entries()) {
      if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
        requestHistory.delete(entryKey);
      }
    }
  }

  next();
};

// Reset function for testing purposes
const resetRateLimiter = () => {
  requestHistory.clear();
};

module.exports = {
  aiRateLimiter,
  resetRateLimiter,
};

