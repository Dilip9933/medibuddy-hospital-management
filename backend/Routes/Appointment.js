const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new appointment
router.post("/", async (req, res) => {
  try {
    const {
      patient,
      patientName,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    if (!patientName || !doctor || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        message: "Patient name, doctor, date and time are required",
      });
    }

    if (!mongoose.isValidObjectId(doctor)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    if (patient && !mongoose.isValidObjectId(patient)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    const appointment = await Appointment.create({
      patient,
      patientName,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
    });

    const savedAppointment = await appointment.populate(
      "doctor",
      "name specialization hospital"
    );

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error("Appointment booking error:", error);
    return res.status(500).json({ message: "Failed to book appointment" });
  }
});

router.get("/patient/:patientId", protect, async (req, res) => {
  const { patientId } = req.params;

  if (!mongoose.isValidObjectId(patientId)) {
    return res.status(400).json({ message: "Invalid patient ID" });
  }

  if (patientId !== req.patient.patientId) {
    return res.status(403).json({ message: "Not authorized to view these appointments" });
  }

  try {
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name specialization qualification experience hospital")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return res.json(appointments);
  } catch (error) {
    console.error("Fetch patient appointments error:", error);
    return res.status(500).json({
      message: "Failed to fetch patient appointments",
    });
  }
});

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name specialization hospital")
      .populate("patient", "fullName email")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return res.json(appointments);
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

module.exports = require("./appointmentsroutes");
