// middleware/logger.js

// Logger middleware prints request details for every incoming request.
const logger = (req, res, next) => {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url}`);

  // Call next() to pass control to the next middleware or route handler.
  next();
};

module.exports = logger;
