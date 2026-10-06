import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const storedPatient = localStorage.getItem("patient");
        const token = localStorage.getItem("token");

        if (!storedPatient || !token) {
          throw new Error("Please log in to view your appointments.");
        }

        const patient = JSON.parse(storedPatient);

        if (!patient?.id) {
          throw new Error("Patient information is missing. Please log in again.");
        }

        const response = await fetch(
          `${API_URL}/appointments/patient/${encodeURIComponent(patient.id)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(data?.message || "Unable to fetch appointments.");
        }

        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid appointments response.");
        }

        setAppointments(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError.message || "Unable to load appointments.");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  async function handleCancelAppointment(appointmentId) {
    const token = localStorage.getItem("token");

    if (!token) {
      setActionError("Please log in again to cancel this appointment.");
      return;
    }

    setCancellingId(appointmentId);
    setActionError("");

    try {
      const response = await fetch(
        `${API_URL}/appointments/${encodeURIComponent(appointmentId)}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to cancel appointment.");
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === appointmentId
            ? data.appointment
            : appointment
        )
      );
    } catch (cancelError) {
      setActionError(cancelError.message || "Unable to cancel appointment.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <main className="page-container my-appointments-page">
      <h1>My Appointments</h1>
      <p>View your scheduled appointments.</p>

      {loading && <p role="status">Loading your appointments...</p>}

      {!loading && error && (
        <div className="appointment-notice" role="alert">
          <p>{error}</p>
          {!localStorage.getItem("token") && (
            <Link className="primary-btn" to="/login">
              Log in
            </Link>
          )}
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <section className="appointment-empty-state">
          <h2>No appointments yet</h2>
          <p>Your upcoming appointments will appear here.</p>
          <Link className="primary-btn" to="/appointments">
            Book an appointment
          </Link>
        </section>
      )}

      {!loading && !error && appointments.length > 0 && (
        <div className="appointment-list">
          {actionError && (
            <p className="error-message" role="alert">
              {actionError}
            </p>
          )}
          {appointments.map((appointment) => (
            <article className="appointment-history-item" key={appointment._id}>
              <div className="appointment-history-heading">
                <div>
                  <h2>{appointment.doctor?.name || "Doctor"}</h2>
                  <p>{appointment.doctor?.specialization || "Specialist"}</p>
                </div>
                <span className="appointment-status">
                  {appointment.status || "Booked"}
                </span>
              </div>

              <dl className="appointment-details">
                <div>
                  <dt>Date</dt>
                  <dd>{appointment.appointmentDate}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{appointment.appointmentTime}</dd>
                </div>
                <div>
                  <dt>Qualification</dt>
                  <dd>{appointment.doctor?.qualification || "Not listed"}</dd>
                </div>
                <div>
                  <dt>Hospital</dt>
                  <dd>{appointment.doctor?.hospital || "Not listed"}</dd>
                </div>
              </dl>

              <div className="appointment-reason">
                <strong>Reason for visit</strong>
                <p>{appointment.reason || "Not provided"}</p>
              </div>

              {appointment.status !== "Cancelled" && (
                <button
                  type="button"
                  className="cancel-appointment-btn"
                  onClick={() => handleCancelAppointment(appointment._id)}
                  disabled={cancellingId === appointment._id}
                >
                  {cancellingId === appointment._id
                    ? "Cancelling..."
                    : "Cancel Appointment"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyAppointments;
