// server.js

// Import the Express module to create the web application.
const express = require('express');

// Create the Express application instance.
const app = express();

// Set the PORT value. This is the network port where the server will listen.
const PORT = 3000;

// Use express.json() middleware to parse JSON request bodies.
app.use(express.json());

// Use logger middleware to print request information for every request.
const logger = require('./middleware/logger');
app.use(logger);

// Mount the task routes from the routes/taskRoutes.js file.
const taskRoutes = require('./routes/taskRoutes');
app.use('/', taskRoutes);

// Define a simple route for GET / that returns a message.
app.get('/', (req, res) => {
  res.send('Task Manager API Running');
});

// Use global error handler as the last middleware.
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start the server and listen on the defined PORT.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
