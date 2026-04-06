const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// Mark attendance
router.post("/mark", async (req, res) => {
  try {
    const { studentId, name } = req.body;

    const record = new Attendance({ studentId, name });
    await record.save();

    res.json({ message: "Attendance marked ✅", record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;