import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMedicalRecords() {
      try {
        const storedPatient = localStorage.getItem("patient");
        const token = localStorage.getItem("token");

        if (!storedPatient || !token) {
          throw new Error("Please log in to view your medical records.");
        }

        const patient = JSON.parse(storedPatient);

        if (!patient?.id) {
          throw new Error(
            "Patient information is missing. Please log in again."
          );
        }

        const response = await fetch(
          `${API_URL}/medical-records/patient/${encodeURIComponent(
            patient.id
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const contentType = response.headers.get("content-type") || "";

        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(
            data?.message || "Unable to fetch medical records."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "The server returned an invalid medical records response."
          );
        }

        setRecords(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError(
          fetchError.message || "Unable to load medical records."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMedicalRecords();
  }, []);

  return (
    <main className="page-container medical-records-page">
      <h1>Medical Records</h1>

      <p>View your medical history and health records.</p>

      {loading && (
        <p role="status">
          Loading your medical records...
        </p>
      )}

      {!loading && error && (
        <div className="medical-record-notice" role="alert">
          <p>{error}</p>

          {!localStorage.getItem("token") && (
            <Link className="primary-btn" to="/login">
              Log in
            </Link>
          )}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <section className="medical-record-empty-state">
          <h2>No medical records yet</h2>

          <p>
            Your medical records will appear here when they are
            added to your account.
          </p>
        </section>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="medical-record-list">
          {records.map((record) => (
            <article
              className="medical-record-card"
              key={record._id}
            >
              <div className="medical-record-heading">
                <div>
                  <h2>{record.title}</h2>

                  <p>
                    {record.provider || "Provider not listed"}
                  </p>
                </div>

                <span className="medical-record-date">
                  {record.recordDate
                    ? new Date(record.recordDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Date not available"}
                </span>
              </div>

              {record.description && (
                <div className="medical-record-description">
                  <strong>Description</strong>

                  <p>{record.description}</p>
                </div>
              )}

              {record.fileUrl && (
                <a
                  href={record.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="medical-record-file-btn"
                >
                  View Record File
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MedicalRecords;
