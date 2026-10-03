const express = require("express");
const mongoose = require("mongoose");

const Prescription = require("../models/Prescription");
const Doctor = require("../models/Doctor");
const Patient = require("../models/patient");

const protect = require("../middleware/authMiddleware");
const doctorProtect = require("../middleware/doctorAuthMiddleware");

const router = express.Router();

// Get prescriptions of logged-in patient
router.get("/patient/:patientId", protect, async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({
        message: "Invalid patient ID",
      });
    }

    if (patientId !== req.patient.patientId) {
      return res.status(403).json({
        message: "Not authorized to view these prescriptions",
      });
    }

    const prescriptions = await Prescription.find({
      patient: patientId,
    })
      .populate("doctor", "name specialization hospital")
      .sort({ prescriptionDate: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Fetch prescriptions error:", error);

    res.status(500).json({
      message: "Failed to fetch prescriptions",
    });
  }
});

// Add prescription - doctor only
router.post("/", doctorProtect, async (req, res) => {
  try {
    const doctorId = req.doctor?.doctorId;

    if (!mongoose.isValidObjectId(doctorId)) {
      return res.status(403).json({
        message: "Only authenticated doctors can add prescriptions",
      });
    }

    const {
      patient,
      medicine,
      dosage,
      frequency,
      duration,
      instructions,
      prescriptionDate,
    } = req.body;

    if (
      !patient ||
      !medicine?.trim() ||
      !dosage?.trim() ||
      !frequency?.trim() ||
      !duration?.trim()
    ) {
      return res.status(400).json({
        message:
          "Patient, medicine, dosage, frequency, and duration are required",
      });
    }

    if (!mongoose.isValidObjectId(patient)) {
      return res.status(400).json({
        message: "Invalid patient ID",
      });
    }

    if (
      prescriptionDate &&
      Number.isNaN(Date.parse(prescriptionDate))
    ) {
      return res.status(400).json({
        message: "Invalid prescription date",
      });
    }

    const [doctor, patientExists] = await Promise.all([
      Doctor.findById(doctorId),
      Patient.exists({ _id: patient }),
    ]);

    if (!doctor) {
      return res.status(403).json({
        message: "Doctor account not found",
      });
    }

    if (!patientExists) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const prescription = await Prescription.create({
      patient,
      doctor: doctorId,
      medicine: medicine.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
      instructions: instructions?.trim() || "",
      prescriptionDate,
    });

    res.status(201).json({
      message: "Prescription added successfully",
      prescription,
    });
  } catch (error) {
    console.error("Add prescription error:", error);

    res.status(500).json({
      message: "Failed to add prescription",
    });
  }
});

module.exports = router;