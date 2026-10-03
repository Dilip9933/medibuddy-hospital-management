const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
// Patient Registration
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      password,
    } = req.body;

    const existingPatient = await Patient.findOne({ email });

    if (existingPatient) {
      return res.status(400).json({
        message: "Patient with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({
      fullName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      password: hashedPassword,
    });

    await patient.save();

    res.status(201).json({
      message: "Patient registered successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// Patient Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      patient.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        patientId: patient._id,
        email: patient.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      patient: {
        id: patient._id,
        fullName: patient.fullName,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// Get logged-in patient profile
router.get("/profile", protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient.patientId).select(
      "-password"
    );

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json({
      patient,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to fetch patient profile",
    });
  }
});

// Update logged-in patient profile
router.put("/profile", protect, async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      gender,
      phone,
      address,
      bloodGroup,
    } = req.body;

    const patient = await Patient.findById(req.patient.patientId);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // Update only the profile fields
    patient.fullName = fullName;
    patient.dateOfBirth = dateOfBirth;
    patient.gender = gender;
    patient.phone = phone;
    patient.address = address;
    patient.bloodGroup = bloodGroup;

    await patient.save();

    const updatedPatient = await Patient.findById(
      req.patient.patientId
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    res.status(500).json({
      message: "Unable to update patient profile",
    });
  }
});

module.exports = router;