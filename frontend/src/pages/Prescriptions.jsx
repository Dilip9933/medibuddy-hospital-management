import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        const storedPatient = localStorage.getItem("patient");
        const token = localStorage.getItem("token");

        if (!storedPatient || !token) {
          throw new Error(
            "Please log in to view your prescriptions."
          );
        }

        const patient = JSON.parse(storedPatient);

        if (!patient?.id) {
          throw new Error(
            "Patient information is missing. Please log in again."
          );
        }

        const response = await fetch(
          `${API_URL}/prescriptions/patient/${encodeURIComponent(
            patient.id
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const contentType =
          response.headers.get("content-type") || "";

        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to fetch prescriptions."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "The server returned an invalid prescriptions response."
          );
        }

        setPrescriptions(data);
      } catch (fetchError) {
        console.error(fetchError);

        setError(
          fetchError.message ||
            "Unable to load prescriptions."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPrescriptions();
  }, []);

  return (
    <main className="page-container">
      <h1>My Prescriptions</h1>

      <p>
        View medicines prescribed by your doctors.
      </p>

      {loading && (
        <p role="status">
          Loading your prescriptions...
        </p>
      )}

      {!loading && error && (
        <div role="alert">
          <p>{error}</p>

          {!localStorage.getItem("token") && (
            <Link
              className="primary-btn"
              to="/login"
            >
              Log in
            </Link>
          )}
        </div>
      )}

      {!loading &&
        !error &&
        prescriptions.length === 0 && (
          <section>
            <h2>No prescriptions yet</h2>

            <p>
              Your prescriptions will appear here when
              a doctor adds them to your account.
            </p>
          </section>
        )}

      {!loading &&
        !error &&
        prescriptions.length > 0 && (
          <div>
            {prescriptions.map((prescription) => (
              <article
                key={prescription._id}
              >
                <h2>{prescription.medicine}</h2>

                {prescription.doctor && (
                  <p>
                    <strong>Doctor:</strong>{" "}
                    {prescription.doctor.name}
                  </p>
                )}

                {prescription.doctor
                  ?.specialization && (
                  <p>
                    <strong>Specialization:</strong>{" "}
                    {prescription.doctor.specialization}
                  </p>
                )}

                {prescription.doctor?.hospital && (
                  <p>
                    <strong>Hospital:</strong>{" "}
                    {prescription.doctor.hospital}
                  </p>
                )}

                <p>
                  <strong>Dosage:</strong>{" "}
                  {prescription.dosage}
                </p>

                <p>
                  <strong>Frequency:</strong>{" "}
                  {prescription.frequency}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {prescription.duration}
                </p>

                {prescription.prescriptionDate && (
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      prescription.prescriptionDate
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}

                {prescription.instructions && (
                  <p>
                    <strong>Instructions:</strong>{" "}
                    {prescription.instructions}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
    </main>
  );
}

export default Prescriptions;