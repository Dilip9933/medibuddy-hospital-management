import { useEffect, useState } from "react";
import API_URL from "../api";

function DoctorBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    try {
      const token = localStorage.getItem("doctorToken");

      const response = await fetch(`${API_URL}/bills/doctor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }

      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load bills.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading bills...</p>;
  }

  return (
    <div className="page-container">
      <h1>Doctor Bills</h1>

      {error && <p className="error-message">{error}</p>}

      {!error && bills.length === 0 && <p>No bills found.</p>}

      {bills.map((bill) => (
        <div className="card" key={bill._id}>
          <h3>{bill.title || "Medical Bill"}</h3>

          <p>
            <strong>Patient:</strong>{" "}
            {bill.patientName || bill.patient?.fullName || "N/A"}
          </p>

          <p>
            <strong>Amount:</strong> ₹{bill.amount || 0}
          </p>

          <p>
            <strong>Status:</strong> {bill.status || "Pending"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DoctorBills;