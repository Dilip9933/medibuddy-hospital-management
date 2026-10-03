const express = require("express");
const mongoose = require("mongoose");
const MedicalRecord = require("../models/MedicalRecord");
const Doctor = require("../models/Doctor");
const Patient = require("../models/patient");
const protect = require("../middleware/authMiddleware");
const doctorProtect = require("../middleware/doctorAuthMiddleware");

const router = express.Router();

// Get medical records of logged-in patient
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
        message: "Not authorized to view these medical records",
      });
    }

    const records = await MedicalRecord.find({
      patient: patientId,
    }).sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error("Fetch medical records error:", error);

    res.status(500).json({
      message: "Failed to fetch medical records",
    });
  }
});

router.post("/", doctorProtect, async (req, res) => {
  try {
    const role = req.doctor?.role?.toLowerCase();
    const doctorId = req.doctor?.doctorId;

    if (role !== "doctor" || !mongoose.isValidObjectId(doctorId)) {
      return res.status(403).json({
        message: "Only authenticated doctors can add medical records",
      });
    }

    const {
      patient,
      title,
      recordDate,
      description,
      fileUrl,
    } = req.body;

    if (!patient || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Patient and title are required",
      });
    }

    if (!mongoose.isValidObjectId(patient)) {
      return res.status(400).json({
        message: "Invalid patient ID",
      });
    }

    if (recordDate && Number.isNaN(Date.parse(recordDate))) {
      return res.status(400).json({
        message: "Invalid record date",
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

    const record = await MedicalRecord.create({
      patient,
      title: title.trim(),
      provider: doctor.name,
      recordDate,
      description,
      fileUrl,
    });

    res.status(201).json({
      message: "Medical record added successfully",
      record,
    });
  } catch (error) {
    console.error("Add medical record error:", error);

    res.status(500).json({
      message: "Failed to add medical record",
    });
  }
});

// Get patient list for authenticated doctors
router.get("/patients", doctorProtect, async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("_id fullName")
      .sort({ fullName: 1 });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Fetch patients for doctor error:", error);

    res.status(500).json({
      message: "Failed to fetch patients",
    });
  }
});

module.exports = router;
