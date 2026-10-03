const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      trim: true,
      default: "",
    },
    recordDate: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    fileUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
