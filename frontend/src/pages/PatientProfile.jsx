import { useEffect, useState } from "react";
import API_URL from "../api";

function PatientProfile() {
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  // Fetch patient profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your profile.");
        }

        const response = await fetch(`${API_URL}/patients/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Unable to fetch profile.");
        }

        setPatient(data.patient);

        setFormData({
          fullName: data.patient.fullName || "",
          dateOfBirth: data.patient.dateOfBirth
            ? data.patient.dateOfBirth.split("T")[0]
            : "",
          gender: data.patient.gender || "",
          phone: data.patient.phone || "",
          email: data.patient.email || "",
          address: data.patient.address || "",
          bloodGroup: data.patient.bloodGroup || "",
        });
      } catch (profileError) {
        console.error(profileError);
        setError(profileError.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Save profile
  async function handleSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/patients/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone,
          address: formData.address,
          bloodGroup: formData.bloodGroup,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update profile.");
      }

      setPatient(data.patient);

      setFormData({
        fullName: data.patient.fullName || "",
        dateOfBirth: data.patient.dateOfBirth
          ? data.patient.dateOfBirth.split("T")[0]
          : "",
        gender: data.patient.gender || "",
        phone: data.patient.phone || "",
        email: data.patient.email || "",
        address: data.patient.address || "",
        bloodGroup: data.patient.bloodGroup || "",
      });

      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (saveError) {
      console.error(saveError);
      setError(saveError.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading your profile...</p>
      </main>
    );
  }

  if (error && !patient) {
    return (
      <main className="page-container">
        <div className="appointment-notice" role="alert">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container patient-profile-page">
      <h1>My Profile</h1>
      <p>View and manage your personal information.</p>

      {message && (
        <div className="appointment-notice" role="status">
          <p>{message}</p>
        </div>
      )}

      {error && (
        <div className="appointment-notice" role="alert">
          <p>{error}</p>
        </div>
      )}

      <section className="patient-profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {patient?.fullName?.charAt(0)?.toUpperCase() || "P"}
          </div>

          <div>
            <h2>{patient?.fullName || "Patient"}</h2>
            <p>{patient?.email || ""}</p>
          </div>
        </div>

        {!editing ? (
          <>
            <div className="profile-details">
              <div>
                <strong>Full Name</strong>
                <span>{patient?.fullName || "Not provided"}</span>
              </div>

              <div>
                <strong>Date of Birth</strong>
                <span>
                  {patient?.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </span>
              </div>

              <div>
                <strong>Gender</strong>
                <span>{patient?.gender || "Not provided"}</span>
              </div>

              <div>
                <strong>Phone</strong>
                <span>{patient?.phone || "Not provided"}</span>
              </div>

              <div>
                <strong>Email</strong>
                <span>{patient?.email || "Not provided"}</span>
              </div>

              <div>
                <strong>Blood Group</strong>
                <span>{patient?.bloodGroup || "Not provided"}</span>
              </div>

              <div className="profile-full-width">
                <strong>Address</strong>
                <span>{patient?.address || "Not provided"}</span>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                setEditing(true);
                setMessage("");
                setError("");
              }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form className="patient-profile-form" onSubmit={handleSave}>
            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Date of Birth
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Gender
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Phone
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
              <small>Email cannot be changed here.</small>
            </label>

            <label>
              Blood Group
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </label>

            <label className="profile-full-width">
              Address
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                required
              />
            </label>

            <div className="profile-form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setEditing(false);
                  setMessage("");
                  setError("");
                }}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default PatientProfile;
