// Import the mongoose library for MongoDB interaction
const mongoose = require("mongoose");

// Define the asynchronous function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    }); 
    
    // Log a success message when the connection is successful
    console.log("MongoDB connected...");
  } catch (err) {
    // If an error occurs during the connection, log the error message
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
