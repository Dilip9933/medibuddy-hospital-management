import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function CreateBill() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    appointment: "",
    consultationFee: "",
    medicineCharges: "",
    labCharges: "",
    otherCharges: "",
    paymentStatus: "Pending",
    paymentMethod: "Not Paid",
    billDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("doctorToken");

        const response = await fetch(
          `${API}/medical-records/patients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch patients");
        }

        setPatients(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const total =
    (Number(form.consultationFee) || 0) +
    (Number(form.medicineCharges) || 0) +
    (Number(form.labCharges) || 0) +
    (Number(form.otherCharges) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.patient) {
      setError("Please select a patient.");
      return;
    }

    try {
      const token = localStorage.getItem("doctorToken");

      const response = await fetch(`${API}/bills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create bill");
      }

      setMessage("Bill created successfully! ✅");

      setForm({
        patient: "",
        appointment: "",
        consultationFee: "",
        medicineCharges: "",
        labCharges: "",
        otherCharges: "",
        paymentStatus: "Pending",
        paymentMethod: "Not Paid",
        billDate: new Date().toISOString().split("T")[0],
        description: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h1>Create Patient Bill 🧾</h1>

      {message && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>Patient</label>
        <br />
        <select
          name="patient"
          value={form.patient}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>

          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.fullName}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>Appointment ID (optional)</label>
        <br />
        <input
          type="text"
          name="appointment"
          value={form.appointment}
          onChange={handleChange}
          placeholder="Enter appointment ID if available"
        />

        <br />
        <br />

        <label>Consultation Fee</label>
        <br />
        <input
          type="number"
          name="consultationFee"
          value={form.consultationFee}
          onChange={handleChange}
          min="0"
          placeholder="₹"
        />

        <br />
        <br />

        <label>Medicine Charges</label>
        <br />
        <input
          type="number"
          name="medicineCharges"
          value={form.medicineCharges}
          onChange={handleChange}
          min="0"
          placeholder="₹"
        />

        <br />
        <br />

        <label>Lab Charges</label>
        <br />
        <input
          type="number"
          name="labCharges"
          value={form.labCharges}
          onChange={handleChange}
          min="0"
          placeholder="₹"
        />

        <br />
        <br />

        <label>Other Charges</label>
        <br />
        <input
          type="number"
          name="otherCharges"
          value={form.otherCharges}
          onChange={handleChange}
          min="0"
          placeholder="₹"
        />

        <br />
        <br />

        <h2>Total Amount: ₹{total}</h2>

        <label>Payment Status</label>
        <br />
        <select
          name="paymentStatus"
          value={form.paymentStatus}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>

        <br />
        <br />

        <label>Payment Method</label>
        <br />
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
        >
          <option value="Not Paid">Not Paid</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Online">Online</option>
        </select>

        <br />
        <br />

        <label>Bill Date</label>
        <br />
        <input
          type="date"
          name="billDate"
          value={form.billDate}
          onChange={handleChange}
        />

        <br />
        <br />

        <label>Description</label>
        <br />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter bill description"
          rows="4"
        />

        <br />
        <br />

        <button type="submit">
          Create Bill 🧾
        </button>
      </form>
    </div>
  );
}

export default CreateBill;