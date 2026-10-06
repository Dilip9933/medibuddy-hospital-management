import { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

const DOCTORS_API_URL = `${API_URL}/doctors`;

const bodyParts = [
  "Brain & Head",
  "Eyes",
  "Ear, Nose & Throat",
  "Heart",
  "Lungs",
  "Stomach",
  "Bones & Joints",
  "Skin",
  "Teeth",
  "General Health",
];

function Doctors() {
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePartSelect(part) {
    setSelectedPart(part);
    setSelectedDoctor(null);
    setDoctors([]);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${DOCTORS_API_URL}/search?bodyPart=${encodeURIComponent(part)}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch doctors");
      }

      setDoctors(await response.json());
    } catch {
      setError(
        "Doctors could not be loaded. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  if (selectedDoctor) {
    return (
      <div className="doctor-profile-page">
        <button
          className="back-doctors-button"
          onClick={() => setSelectedDoctor(null)}
        >
          Back to Doctors
        </button>

        <div className="doctor-profile-card">
          <div className="doctor-profile-header">
            <div className="doctor-profile-photo">👨‍⚕️</div>
            <div className="doctor-profile-heading">
              <h1>{selectedDoctor.name}</h1>
              <p className="profile-specialization">
                {selectedDoctor.specialization}
              </p>
              <span className="available-badge">Available</span>
            </div>
          </div>

          <hr />

          <div className="profile-information">
            <div className="profile-info-box">
              <span className="info-icon">🎓</span>
              <div>
                <small>Qualification</small>
                <strong>{selectedDoctor.qualification}</strong>
              </div>
            </div>
            <div className="profile-info-box">
              <span className="info-icon">🏆</span>
              <div>
                <small>Experience</small>
                <strong>{selectedDoctor.experience} years</strong>
              </div>
            </div>
            <div className="profile-info-box">
              <span className="info-icon">🏥</span>
              <div>
                <small>Department</small>
                <strong>{selectedDoctor.bodyPart}</strong>
              </div>
            </div>
            <div className="profile-info-box">
              <span className="info-icon">📍</span>
              <div>
                <small>Hospital</small>
                <strong>{selectedDoctor.hospital}</strong>
              </div>
            </div>
          </div>

          <div className="about-doctor">
            <h2>About the Doctor</h2>
            <p>
              {selectedDoctor.about ||
                "Dedicated to providing quality healthcare and personalized treatment."}
            </p>
          </div>

          <div className="consultation-section">
            <div>
              <h3>Consultation</h3>
              <p>Professional medical consultation</p>
            </div>
            <div className="consultation-price">Rs 500</div>
          </div>

          <Link to="/appointments" className="book-appointment-button">
            Book Appointment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="doctor-directory">
      <section className="doctor-section">
        <p className="section-title">SPECIALIST DIRECTORY</p>
        <h1>Find the right doctor</h1>
        <p>Select the area where you need medical attention.</p>

        <div className="body-buttons">
          {bodyParts.map((part) => (
            <button
              type="button"
              key={part}
              className={selectedPart === part ? "active" : ""}
              onClick={() => handlePartSelect(part)}
            >
              {part}
            </button>
          ))}
        </div>

        {loading && <p aria-live="polite">Loading doctors...</p>}
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && selectedPart && doctors.length === 0 && (
          <p>No doctors found for {selectedPart}.</p>
        )}

        {doctors.length > 0 && (
          <div className="doctor-list">
            {doctors.map((doctor) => (
              <article className="doctor-card" key={doctor._id}>
                <h3>{doctor.name}</h3>
                <p>{doctor.specialization}</p>
                <p>{doctor.qualification}</p>
                <p>{doctor.experience} years of experience</p>
                <button
                  type="button"
                  className="doctor-button"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  View Doctor
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Doctors;
