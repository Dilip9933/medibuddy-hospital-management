import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [doctor] = useState(() => {
    const token = localStorage.getItem("doctorToken");
    const storedDoctor = localStorage.getItem("doctor");

    if (!token || !storedDoctor) {
      return null;
    }

    try {
      return JSON.parse(storedDoctor);
    } catch (error) {
      console.error("Unable to read doctor information:", error);
      return null;
    }
  });

  useEffect(() => {
    if (!doctor) {
      localStorage.removeItem("doctor");
      localStorage.removeItem("doctorToken");
      navigate("/doctor-login");
    }
  }, [doctor, navigate]);

  function handleLogout() {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctor");

    alert("Doctor logged out successfully.");

    navigate("/doctor-login");
  }

  if (!doctor) {
    return (
      <main className="page-container">
        <p>Loading doctor dashboard...</p>
      </main>
    );
  }

  return (
    <main className="page-container doctor-dashboard">
      <section className="doctor-dashboard-header">
        <div>
          <p>Welcome back</p>

          <h1>{doctor.name}</h1>

          <p>
            {doctor.specialization || "Medical Specialist"}
          </p>
        </div>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </section>

      <section className="doctor-profile-summary">
        <h2>Doctor Profile</h2>

        <p>
          <strong>Email:</strong> {doctor.email}
        </p>

        <p>
          <strong>Hospital:</strong>{" "}
          {doctor.hospital || "Not listed"}
        </p>

        <p>
          <strong>Specialization:</strong>{" "}
          {doctor.specialization || "Not listed"}
        </p>

        <p>
          <strong>Role:</strong> {doctor.role}
        </p>
      </section>

      <section className="doctor-dashboard-actions">
        <h2>Quick Actions</h2>

        <div className="dashboard-action-grid">
          <button type="button">
            View Appointments
          </button>

          <button type="button">
            View Patients
          </button>

          <button
            type="button"
            onClick={() => navigate("/add-medical-record")}
          >
            Add Medical Record
          </button>

          <button
            type="button"
            onClick={() => navigate("/add-prescription")}
          >
            Add Prescription
          </button>

          <button
            type="button"
            onClick={() => navigate("/create-bill")}
          >
            Create Bill 🧾
          </button>

          <button
            type="button"
            onClick={() => navigate("/doctor-bills")}
          >
            Patient Bills 💳
          </button>
        </div>
      </section>
    </main>
  );
}

export default DoctorDashboard;
