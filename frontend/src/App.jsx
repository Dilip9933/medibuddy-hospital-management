import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import Patients from "./pages/patients";
import Appointments from "./pages/Appointments";
import MyAppointments from "./pages/MyAppointments";
import PatientProfile from "./pages/PatientProfile";
import MedicalRecords from "./pages/MedicalRecords";
import Prescriptions from "./pages/Prescriptions";
import Bills from "./pages/Bills";
import PayBill from "./pages/PayBill";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorBills from "./pages/DoctorBills";
import AddMedicalRecord from "./pages/AddMedicalRecord";
import AddPrescription from "./pages/AddPrescription";
import CreateBill from "./pages/CreateBill";
import Dashboard from "./pages/Dashboard";
import BodySelection from "./assets/BodySelection";

const hospitals = [
  {
    name: "Medibuddy Central Hospital",
    address: "12 Wellness Avenue, Downtown",
    specialty: "General care and emergency services",
  },
  {
    name: "Green Valley Medical Center",
    address: "48 Green Valley Road, North District",
    specialty: "Family medicine and pediatrics",
  },
  {
    name: "Riverside Specialist Hospital",
    address: "7 Riverside Street, West End",
    specialty: "Cardiology and specialist care",
  },
];

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const matchingHospitals = hospitals.filter((hospital) =>
    `${hospital.name} ${hospital.address} ${hospital.specialty}`
      .toLowerCase()
      .includes(normalizedSearch)
  );

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="welcome">WELCOME TO MEDIBUDDY</p>

          <h1>
            Your Health,
            <br />
            Our Priority
          </h1>

          <p className="description">
            Quality healthcare made simple, accessible and convenient.
            Manage appointments, doctors and patient care in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/appointments" className="primary-btn">
              Book Appointment
            </Link>

            <Link to="/doctors" className="secondary-btn">
              Explore Doctors
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="doctor-icon">👨‍⚕️</div>

          <h2>Professional Healthcare</h2>

          <p>
            Connect with experienced doctors and manage your healthcare
            easily.
          </p>
        </div>
      </section>

      {/* Hospital Search */}
      <section
        className="hospital-search"
        aria-labelledby="hospital-search-title"
      >
        <div className="search-heading">
          <p className="section-title">FIND CARE NEAR YOU</p>

          <h2 id="hospital-search-title">
            Search hospitals by name or address
          </h2>
        </div>

        <label className="search-field">
          <span>Search hospitals</span>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="e.g. Riverside or Downtown"
          />
        </label>

        <div className="hospital-results" aria-live="polite">
          {matchingHospitals.length > 0 ? (
            matchingHospitals.map((hospital) => (
              <article
                className="hospital-result"
                key={hospital.name}
              >
                <div>
                  <h3>{hospital.name}</h3>

                  <p>{hospital.address}</p>

                  <small>{hospital.specialty}</small>
                </div>

                <Link
                  to="/appointments"
                  className="secondary-btn"
                >
                  Book visit
                </Link>
              </article>
            ))
          ) : (
            <p className="no-results">
              No hospitals found. Try another name or address.
            </p>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <p className="section-title">OUR SERVICES</p>

        <h2>Everything You Need</h2>

        <div className="service-container">

          <Link
            to="/doctors"
            className="service-card service-link"
          >
            <span>👨‍⚕️</span>

            <h3>Find Doctors</h3>

            <p>
              Find and connect with qualified doctors.
            </p>
          </Link>

          <Link
            to="/appointments"
            className="service-card service-link"
          >
            <span>📅</span>

            <h3>Appointments</h3>

            <p>
              Book and manage your appointments easily.
            </p>
          </Link>

          <Link
            to="/medical-records"
            className="service-card service-link"
          >
            <span>📋</span>

            <h3>Medical Records</h3>

            <p>
              Keep your medical information organized.
            </p>
          </Link>

          <Link
            to="/body-selection"
            className="service-card service-link"
          >
            <span>🧍</span>

            <h3>Find Specialist</h3>

            <p>
              Select the affected body part and find the right specialist.
            </p>
          </Link>

        </div>
      </section>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>

      <div className="app">

        {/* Navigation */}
        <nav className="navbar">

          <Link to="/" className="logo">
            🏥 MediBuddy
          </Link>

          <div className="nav-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/doctors">
              Doctors
            </Link>

            <Link to="/patients">
              Patients
            </Link>

            <Link to="/appointments">
              Book Appointment
            </Link>

            <Link to="/my-appointments">
              My Appointments
            </Link>

            <Link to="/body-selection">
              Find Specialist
            </Link>

            <Link
              to="/login"
              className="login-btn"
            >
              Patient Login
            </Link>

            <Link
              to="/doctor-login"
              className="doctor-login-btn"
            >
              🩺 Doctor Login
            </Link>

          </div>

        </nav>

        {/* Pages */}
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/doctors"
            element={<Doctors />}
          />

          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
            path="/appointments"
            element={<Appointments />}
          />

          <Route
            path="/my-appointments"
            element={<MyAppointments />}
          />

          <Route
            path="/profile"
            element={<PatientProfile />}
          />

          <Route
            path="/medical-records"
            element={<MedicalRecords />}
          />

          <Route
            path="/prescriptions"
            element={<Prescriptions />}
          />

          <Route
            path="/bills"
            element={<Bills />}
          />

          <Route
            path="/pay-bill"
            element={<PayBill />}
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor-login"
            element={<DoctorLogin />}
          />
          <Route
            path="/doctors/login"
            element={<DoctorLogin />}
          />

          <Route
            path="/doctor-dashboard"
            element={<DoctorDashboard />}
          />

          <Route
            path="/doctor-bills"
            element={<DoctorBills />}
          />

          <Route
            path="/add-medical-record"
            element={<AddMedicalRecord />}
          />

          <Route
            path="/add-prescription"
            element={<AddPrescription />}
          />

          <Route
            path="/create-bill"
            element={<CreateBill />}
          />

          {/* Body Part → Specialist */}
          <Route
            path="/body-selection"
            element={<BodySelection />}
          />

        </Routes>

        {/* Footer */}
        <footer>

          <h3>
            🏥 MediBuddy Hospital
          </h3>

          <p>
            Healthcare made simple.
          </p>

          <p>
            © 2026 MediBuddy. All rights reserved.
          </p>

        </footer>

      </div>

    </BrowserRouter>
  );
}

export default App;

