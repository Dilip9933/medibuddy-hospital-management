const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    medicineCharges: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    labCharges: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    otherCharges: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Online", "Not Paid"],
      default: "Not Paid",
    },

    billDate: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bill", billSchema);