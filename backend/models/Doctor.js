const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bodyPart: { type: String, required: true, trim: true, index: true },
    specialization: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 },
    hospital: { type: String, required: true, trim: true },
    about: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);