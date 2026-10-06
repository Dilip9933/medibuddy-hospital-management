import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function AddMedicalRecord() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState("");
  const [title, setTitle] = useState("");
  const [recordDate, setRecordDate] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const [loadingPatients, setLoadingPatients] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchPatients() {
      try {
        const token = localStorage.getItem("doctorToken");

        if (!token) {
          navigate("/doctor-login");
          return;
        }

        const response = await fetch(
          `${API_URL}/medical-records/patients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch patients"
          );
        }

        setPatients(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError(
          fetchError.message || "Unable to load patients"
        );
      } finally {
        setLoadingPatients(false);
      }
    }

    fetchPatients();
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = localStorage.getItem("doctorToken");

      if (!token) {
        navigate("/doctor-login");
        return;
      }

      const response = await fetch(
        `${API_URL}/medical-records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patient,
            title,
            recordDate,
            description,
            fileUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add medical record"
        );
      }

      setSuccess("Medical record added successfully! 🎉");

      setPatient("");
      setTitle("");
      setRecordDate("");
      setDescription("");
      setFileUrl("");
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError.message ||
          "Unable to add medical record"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-container">
      <h1>Add Medical Record</h1>

      <p>
        Add a medical record for one of your patients.
      </p>

      {error && (
        <div role="alert">
          {error}
        </div>
      )}

      {success && (
        <div role="status">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patient">
            Select Patient
          </label>

          <select
            id="patient"
            value={patient}
            onChange={(event) =>
              setPatient(event.target.value)
            }
            required
            disabled={loadingPatients}
          >
            <option value="">
              {loadingPatients
                ? "Loading patients..."
                : "Select a patient"}
            </option>

            {patients.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title">
            Record Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Example: Blood Test Report"
            required
          />
        </div>

        <div>
          <label htmlFor="recordDate">
            Record Date
          </label>

          <input
            id="recordDate"
            type="date"
            value={recordDate}
            onChange={(event) =>
              setRecordDate(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter medical record details"
            rows="5"
          />
        </div>

        <div>
          <label htmlFor="fileUrl">
            Record File URL
          </label>

          <input
            id="fileUrl"
            type="url"
            value={fileUrl}
            onChange={(event) =>
              setFileUrl(event.target.value)
            }
            placeholder="Optional file URL"
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving
            ? "Adding Record..."
            : "Add Medical Record"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => navigate("/doctor-dashboard")}
      >
        Back to Doctor Dashboard
      </button>
    </main>
  );
}

export default AddMedicalRecord;