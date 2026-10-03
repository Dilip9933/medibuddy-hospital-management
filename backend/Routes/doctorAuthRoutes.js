const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DoctorAccount = require("../models/DoctorAccount");
const Doctor = require("../models/Doctor");

const router = express.Router();

// Doctor Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const account = await DoctorAccount.findOne({
      email: email.toLowerCase().trim(),
    }).populate("doctor");

    if (!account) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      account.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        doctorId: account.doctor._id,
        email: account.email,
        role: account.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Doctor login successful",
      token,
      doctor: {
        id: account.doctor._id,
        name: account.doctor.name,
        email: account.email,
        specialization: account.doctor.specialization,
        hospital: account.doctor.hospital,
        role: account.role,
      },
    });
  } catch (error) {
    console.error("Doctor login error:", error);

    return res.status(500).json({
      message: "Doctor login failed",
    });
  }
});

module.exports = router;
