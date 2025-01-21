// Load environment variables from .env file
require("dotenv").config();

// Import necessary modules
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// Initialize the Express app
const app = express();

// Connect to the database
connectDB();

// Middleware setup
app.use(express.json()); // To parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(
  cors({
    // Enable Cross-Origin Resource Sharing (CORS) with the configured origin and credentials
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Route Handlers
app.use("/api/auth", require("./routes/auth"));
app.use("/api/youtube", require("./routes/youtube"));
app.use("/api/layout", require("./routes/layout"));

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(err.status || 500).json({
    // Send a JSON response with the error message
    message: err.message || "Internal Server Error",
  });
});

// Set the port for the server
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
