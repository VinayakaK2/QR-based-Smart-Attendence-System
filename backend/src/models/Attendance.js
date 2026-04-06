const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "Present"
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);