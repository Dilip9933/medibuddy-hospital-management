const express = require("express");
const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

router.get("/search", async (req, res) => {
  const bodyPart = req.query.bodyPart?.trim();

  if (!bodyPart) {
    return res.status(400).json({ message: "bodyPart is required" });
  }

  try {
    const doctors = await Doctor.find({ bodyPart }).sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to search doctors" });
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid doctor id" });
  }

  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctor" });
  }
});

module.exports = router;