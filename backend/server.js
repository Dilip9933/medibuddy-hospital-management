const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const patientRoutes = require("./Routes/PatientRoutes");
const doctorRoutes = require("./Routes/DoctorRoutes");
const appointmentRoutes = require("./Routes/appointmentsroutes");
const medicalRecordRoutes = require("./Routes/medicalRecordRoutes");
const doctorAuthRoutes = require("./Routes/doctorAuthRoutes");
const prescriptionRoutes = require("./Routes/prescriptionRoutes");
const billRoutes = require("./Routes/billRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/doctor-auth", doctorAuthRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/bills", billRoutes);

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MongoDB connection skipped: MONGO_URI is missing from backend/.env");
} else {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:");
      console.error(error.message);
    });
}

app.get("/", (req, res) => {
  res.send("MediBuddy Hospital API is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});