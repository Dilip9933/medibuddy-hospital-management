const express = require("express");
const mongoose = require("mongoose");

const Bill = require("../models/Bill");
const Doctor = require("../models/Doctor");
const Patient = require("../models/patient");

const protect = require("../middleware/authMiddleware");
const doctorProtect = require("../middleware/doctorAuthMiddleware");

const router = express.Router();

// Get bills of logged-in patient
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
        message: "Not authorized to view these bills",
      });
    }

    const bills = await Bill.find({
      patient: patientId,
    })
      .populate("doctor", "name specialization hospital")
      .sort({ billDate: -1 });

    res.status(200).json(bills);
  } catch (error) {
    console.error("Fetch bills error:", error);

    res.status(500).json({
      message: "Failed to fetch bills",
    });
  }
});

// Add bill - doctor only
router.post("/", doctorProtect, async (req, res) => {
  try {
    const doctorId = req.doctor?.doctorId;

    if (!mongoose.isValidObjectId(doctorId)) {
      return res.status(403).json({
        message: "Only authenticated doctors can create bills",
      });
    }

    const {
      patient,
      appointment,
      consultationFee,
      medicineCharges,
      labCharges,
      otherCharges,
      paymentStatus,
      paymentMethod,
      billDate,
      description,
    } = req.body;

    if (!patient) {
      return res.status(400).json({
        message: "Patient is required",
      });
    }

    if (!mongoose.isValidObjectId(patient)) {
      return res.status(400).json({
        message: "Invalid patient ID",
      });
    }

    const fees = {
      consultationFee: Number(consultationFee) || 0,
      medicineCharges: Number(medicineCharges) || 0,
      labCharges: Number(labCharges) || 0,
      otherCharges: Number(otherCharges) || 0,
    };

    if (
      fees.consultationFee < 0 ||
      fees.medicineCharges < 0 ||
      fees.labCharges < 0 ||
      fees.otherCharges < 0
    ) {
      return res.status(400).json({
        message: "Charges cannot be negative",
      });
    }

    if (billDate && Number.isNaN(Date.parse(billDate))) {
      return res.status(400).json({
        message: "Invalid bill date",
      });
    }

    if (
      appointment &&
      !mongoose.isValidObjectId(appointment)
    ) {
      return res.status(400).json({
        message: "Invalid appointment ID",
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

    const totalAmount =
      fees.consultationFee +
      fees.medicineCharges +
      fees.labCharges +
      fees.otherCharges;

    const bill = await Bill.create({
      patient,
      doctor: doctorId,
      appointment: appointment || null,
      consultationFee: fees.consultationFee,
      medicineCharges: fees.medicineCharges,
      labCharges: fees.labCharges,
      otherCharges: fees.otherCharges,
      totalAmount,
      paymentStatus:
        paymentStatus === "Paid" ? "Paid" : "Pending",
      paymentMethod:
        paymentMethod || "Not Paid",
      billDate,
      description: description?.trim() || "",
    });

    res.status(201).json({
      message: "Bill created successfully",
      bill,
    });
  } catch (error) {
    console.error("Create bill error:", error);

    res.status(500).json({
      message: "Failed to create bill",
    });
  }
});

// Get bills created by logged-in doctor
router.get("/doctor", doctorProtect, async (req, res) => {
  try {
    const doctorId = req.doctor?.doctorId;

    if (!mongoose.isValidObjectId(doctorId)) {
      return res.status(403).json({
        message: "Only authenticated doctors can view bills",
      });
    }

    const bills = await Bill.find({
      doctor: doctorId,
    })
      .populate("patient", "fullName email phone")
      .populate("doctor", "name specialization hospital")
      .sort({ billDate: -1 });

    res.status(200).json(bills);
  } catch (error) {
    console.error("Fetch doctor bills error:", error);

    res.status(500).json({
      message: "Failed to fetch doctor bills",
    });
  }
});

// Demo payment - patient only
router.put("/:billId/pay", protect, async (req, res) => {
  try {
    const { billId } = req.params;
    const { paymentMethod } = req.body;

    if (!mongoose.isValidObjectId(billId)) {
      return res.status(400).json({
        message: "Invalid bill ID",
      });
    }

    const allowedMethods = ["UPI", "Card", "Online"];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    const bill = await Bill.findById(billId);

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    // Make sure the bill belongs to the logged-in patient
    if (bill.patient.toString() !== req.patient.patientId) {
      return res.status(403).json({
        message: "Not authorized to pay this bill",
      });
    }

    if (bill.paymentStatus === "Paid") {
      return res.status(400).json({
        message: "Bill is already paid",
      });
    }

    bill.paymentStatus = "Paid";
    bill.paymentMethod = paymentMethod;

    await bill.save();

    res.status(200).json({
      message: "Demo payment successful",
      bill,
    });
  } catch (error) {
    console.error("Demo payment error:", error);

    res.status(500).json({
      message: "Payment failed",
    });
  }
});

module.exports = router;