import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bodyImage from "../assets/body.png";


function Dashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    const accountName = patient?.fullName || "your account";

    localStorage.removeItem("token");
    localStorage.removeItem("patient");
    window.alert(`You have been logged out of ${accountName}'s account.`);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const getPatientProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/patients/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("patient");
          navigate("/login");
          return;
        }

        setPatient(data.patient);
      } catch (error) {
        console.error(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getPatientProfile();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-welcome">WELCOME BACK</p>

          <h1>
            Hello, {patient?.fullName} 👋
          </h1>

          <p>
            Welcome to your MediBuddy patient dashboard.
          </p>
        </div>
<div className="dashboard-user">
  <span>👤 Patient</span>

  <button
    onClick={handleLogout}
    className="logout-btn"
  >
    Logout
  </button>
</div>
      </div>

      {/* Patient Information */}
      <div className="dashboard-overview">
        <div className="patient-info-card">
          <h2>My Information</h2>

          <div className="patient-info-grid">
            <div>
              <strong>Email</strong>
              <p>{patient?.email}</p>
            </div>

            <div>
              <strong>Phone</strong>
              <p>{patient?.phone}</p>
            </div>

            <div>
              <strong>Gender</strong>
              <p>{patient?.gender}</p>
            </div>

            <div>
              <strong>Blood Group</strong>
              <p>{patient?.bloodGroup}</p>
            </div>
          </div>
        </div>

        <aside className="body-overview">
          <div>
            <p className="section-title">HEALTH OVERVIEW</p>
            <h2>Body overview</h2>
            <p>Keep track of your health and medical records in one place.</p>
          </div>
          <img src={bodyImage} alt="Illustration of the human body" />
        </aside>
      </div>

      {/* Patient Services */}
      <div className="dashboard-section">

        <p className="section-title">PATIENT SERVICES</p>

        <h2>Manage Your Healthcare</h2>

        <div className="module-container">

          <div
            className="module-card"
            onClick={() => navigate("/doctors")}
          >
            <span>👨‍⚕️</span>
            <h3>Doctors</h3>
            <p>Find doctors and view their information.</p>
          </div>

          <div
            className="module-card"
            onClick={() => navigate("/appointments")}
          >
            <span>📅</span>
            <h3>Book Appointment</h3>
            <p>Schedule a visit with one of our doctors.</p>
          </div>

          <div
            className="module-card"
            onClick={() => navigate("/my-appointments")}
          >
            <span>🗓️</span>
            <h3>My Appointments</h3>
            <p>View your scheduled visits and appointment details.</p>
          </div>

          <div
            className="module-card"
            onClick={() => navigate("/medical-records")}
          >
            <span>📋</span>
            <h3>Medical Records</h3>
            <p>View your medical history and records.</p>
          </div>

          <div
            className="module-card"
            onClick={() => navigate("/prescriptions")}
          >
            <span>💊</span>
            <h3>My Prescriptions</h3>
            <p>View medicines prescribed by your doctors.</p>
          </div>

          <div
            className="module-card"
            onClick={() => navigate("/bills")}
          >
            <span>🧾</span>
            <h3>My Bills</h3>
            <p>View your hospital bills and payment details.</p>
          </div>

          <div
            className="module-card"
            onClick={() => navigate("/pharmacy")}
          >
            <span>💊</span>
            <h3>Pharmacy</h3>
            <p>View medicines and prescriptions.</p>
          </div>

          <div
            className="module-card"
            onClick={() => navigate("/billing")}
          >
            <span>🧾</span>
            <h3>Billing</h3>
            <p>View your hospital bills.</p>
          </div>

          <div
            className="module-card"
            onClick={() => navigate("/payments")}
          >
            <span>💳</span>
            <h3>Payments</h3>
            <p>View payment history and receipts.</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;