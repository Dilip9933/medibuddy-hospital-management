const mongoose = require("mongoose");
const path = require("path");
const Doctor = require("./models/Doctor");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const doctors = [
  ["Dr. Arun Kumar", "Brain & Head", "Neurologist", "MBBS, MD Neurology", 10],
  ["Dr. Priya Sharma", "Brain & Head", "Neurologist", "MBBS, DM Neurology", 8],
  ["Dr. Nisha Joseph", "Eyes", "Ophthalmologist", "MBBS, MS Ophthalmology", 9],
  ["Dr. Rajesh Menon", "Eyes", "Eye Specialist", "MBBS, MS Ophthalmology", 12],
  ["Dr. Anil Thomas", "Ear, Nose & Throat", "ENT Specialist", "MBBS, MS ENT", 12],
  ["Dr. Sneha Rao", "Ear, Nose & Throat", "ENT Surgeon", "MBBS, DLO", 7],
  ["Dr. Rahul Raj", "Heart", "Cardiologist", "MBBS, MD Cardiology", 12],
  ["Dr. Sneha Thomas", "Heart", "Cardiologist", "MBBS, DM Cardiology", 9],
  ["Dr. Vikram Singh", "Lungs", "Pulmonologist", "MBBS, MD Pulmonary Medicine", 11],
  ["Dr. Meera Nair", "Lungs", "Pulmonologist", "MBBS, MD Respiratory Medicine", 8],
  ["Dr. Ajay Kumar", "Stomach", "Gastroenterologist", "MBBS, MD Gastroenterology", 11],
  ["Dr. Kavya Rao", "Stomach", "Gastroenterologist", "MBBS, DM Gastroenterology", 7],
  ["Dr. Vijay Singh", "Bones & Joints", "Orthopedic Surgeon", "MBBS, MS Orthopedics", 15],
  ["Dr. Anjali Menon", "Bones & Joints", "Orthopedic Specialist", "MBBS, MS Orthopedics", 8],
  ["Dr. Naveen Kumar", "Skin", "Dermatologist", "MBBS, MD Dermatology", 9],
  ["Dr. Pooja Nair", "Skin", "Dermatologist", "MBBS, MD Dermatology", 6],
  ["Dr. Karthik Rao", "Teeth", "Dentist", "BDS, MDS", 10],
  ["Dr. Divya Thomas", "Teeth", "Dental Surgeon", "BDS, MDS", 6],
  ["Dr. Suresh Kumar", "General Health", "General Physician", "MBBS, MD General Medicine", 14],
  ["Dr. Maria Joseph", "General Health", "General Physician", "MBBS, MD Medicine", 9],
].map(([name, bodyPart, specialization, qualification, experience]) => ({
  name,
  bodyPart,
  specialization,
  qualification,
  experience,
  hospital: "City Care Hospital",
  about: `Experienced ${specialization.toLowerCase()} providing patient-centered care.`,
}));

async function seedDoctors() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  await Doctor.deleteMany({});
  await Doctor.insertMany(doctors);
  console.log(`${doctors.length} doctors added successfully`);
  await mongoose.disconnect();
}

seedDoctors().catch(async (error) => {
  console.error("Doctor seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
