require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Doctor = require("./models/Doctor");
const DoctorAccount = require("./models/DoctorAccount");

async function createDoctorAccount() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Get the first doctor from your existing doctors collection
    const doctor = await Doctor.findOne();

    if (!doctor) {
      console.log("No doctor found in the database.");
      process.exit(1);
    }

    const email = "doctor@hospital.com";
    const password = "doctor123";

    // Check if account already exists
    const existingAccount = await DoctorAccount.findOne({
      email,
    });

    if (existingAccount) {
      console.log("Doctor account already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await DoctorAccount.create({
      doctor: doctor._id,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    console.log("Doctor account created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Doctor:", doctor.name);

    process.exit(0);
  } catch (error) {
    console.error("Error creating doctor account:", error);
    process.exit(1);
  }
}

createDoctorAccount();
