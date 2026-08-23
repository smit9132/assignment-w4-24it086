const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Create the Express application instance.
const app = express();

// Set the PORT value.
const PORT = process.env.PORT || 5000;

// Use express.json() middleware to parse JSON request bodies.
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Use logger middleware.
const logger = require("./middleware/logger");
app.use(logger);

// Mount task routes.
const taskRoutes = require('./routes/taskRoutes');
  
app.use("/", taskRoutes);

// Define a simple route for GET /
app.get("/", (req, res) => {
  res.send("Task Manager API Running");
});

// Use global error handler as the last middleware.
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);


// Connect MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.error("❌ MongoDB connection failed. Please check your MONGO_URI and Atlas access settings.");
  });