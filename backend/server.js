const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
const connectDB = require("./src/config/db");
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Server start
const PORT = process.env.PORT || 5000;

//API
const testRoutes = require("./src/routes/testRoutes");

//Attendance API
const attendanceRoutes = require("./src/routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});