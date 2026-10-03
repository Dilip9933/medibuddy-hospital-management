const mongoose = require("mongoose");

const doctorAccountSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["doctor"],
      default: "doctor",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DoctorAccount",
  doctorAccountSchema
);
