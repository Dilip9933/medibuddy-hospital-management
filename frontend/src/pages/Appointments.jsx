import { useEffect, useState } from "react";
import API_URL from "../api";

const emptyForm = {
  patientName: "",
  doctor: "",
  appointmentDate: "",
  appointmentTime: "",
  reason: "",
};

function Appointments() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch(`${API_URL}/doctors`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load doctors.");
        }

        setDoctors(data);
      } catch {
        setError("Unable to load doctors. Make sure the backend is running.");
      } finally {
        setLoadingDoctors(false);
      }
    }

    fetchDoctors();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBooking(true);
    setMessage("");
    setError("");

    try {
      const storedPatient = localStorage.getItem("patient");
      const patient = storedPatient ? JSON.parse(storedPatient) : null;
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, patient: patient?.id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to book appointment.");
      }

      setMessage("Appointment booked successfully.");
      setFormData(emptyForm);
    } catch (submitError) {
      setError(submitError.message || "Unable to book appointment.");
    } finally {
      setBooking(false);
    }
  }

  return (
    <main className="page-container">
      <h1>Book an Appointment</h1>
      <p>Schedule an appointment with one of our doctors.</p>

      <section className="form-card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="patientName">Patient Name</label>
          <input
            id="patientName"
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Enter patient name"
            autoComplete="name"
            required
          />

          <label htmlFor="doctor">Select Doctor</label>
          <select
            id="doctor"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            disabled={loadingDoctors || doctors.length === 0}
            required
          >
            <option value="">
              {loadingDoctors ? "Loading doctors..." : "Select a doctor"}
            </option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>

          <label htmlFor="appointmentDate">Appointment Date</label>
          <input
            id="appointmentDate"
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 10)}
            required
          />

          <label htmlFor="appointmentTime">Appointment Time</label>
          <input
            id="appointmentTime"
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />

          <label htmlFor="reason">Reason for Visit</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Describe the reason for your visit"
            rows={4}
          />

          {message && <p role="status">{message}</p>}
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={booking || loadingDoctors || doctors.length === 0}
          >
            {booking ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Appointments;
