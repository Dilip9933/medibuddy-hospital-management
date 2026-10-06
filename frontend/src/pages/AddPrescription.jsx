import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function AddPrescription() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState("");

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
        `${API_URL}/prescriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patient,
            medicine,
            dosage,
            frequency,
            duration,
            instructions,
            prescriptionDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add prescription"
        );
      }

      setSuccess(
        "Prescription added successfully! 💊🎉"
      );

      setPatient("");
      setMedicine("");
      setDosage("");
      setFrequency("");
      setDuration("");
      setInstructions("");
      setPrescriptionDate("");
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError.message ||
          "Unable to add prescription"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-container">
      <h1>Add Prescription</h1>

      <p>
        Create a prescription for one of your patients.
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
          <label htmlFor="prescription-patient">
            Select Patient
          </label>

          <select
            id="prescription-patient"
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
          <label htmlFor="medicine">
            Medicine
          </label>

          <input
            id="medicine"
            type="text"
            value={medicine}
            onChange={(event) =>
              setMedicine(event.target.value)
            }
            placeholder="Example: Paracetamol"
            required
          />
        </div>

        <div>
          <label htmlFor="dosage">
            Dosage
          </label>

          <input
            id="dosage"
            type="text"
            value={dosage}
            onChange={(event) =>
              setDosage(event.target.value)
            }
            placeholder="Example: 500 mg"
            required
          />
        </div>

        <div>
          <label htmlFor="frequency">
            Frequency
          </label>

          <input
            id="frequency"
            type="text"
            value={frequency}
            onChange={(event) =>
              setFrequency(event.target.value)
            }
            placeholder="Example: Twice a day"
            required
          />
        </div>

        <div>
          <label htmlFor="duration">
            Duration
          </label>

          <input
            id="duration"
            type="text"
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value)
            }
            placeholder="Example: 5 days"
            required
          />
        </div>

        <div>
          <label htmlFor="prescription-date">
            Prescription Date
          </label>

          <input
            id="prescription-date"
            type="date"
            value={prescriptionDate}
            onChange={(event) =>
              setPrescriptionDate(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="instructions">
            Instructions
          </label>

          <textarea
            id="instructions"
            value={instructions}
            onChange={(event) =>
              setInstructions(event.target.value)
            }
            placeholder="Example: Take after food"
            rows="4"
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving
            ? "Adding Prescription..."
            : "Add Prescription"}
        </button>
      </form>

      <button
        type="button"
        onClick={() =>
          navigate("/doctor-dashboard")
        }
      >
        Back to Doctor Dashboard
      </button>
    </main>
  );
}

export default AddPrescription;