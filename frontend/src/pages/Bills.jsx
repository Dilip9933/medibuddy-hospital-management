import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Bills() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token");
        const patientData = JSON.parse(
          localStorage.getItem("patient")
        );

        const patientId =
          patientData?.id || patientData?.patientId || patientData?._id;

        if (!token || !patientId) {
          setError("Please login as a patient.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API}/bills/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch bills"
          );
        }

        setBills(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return <h2>Loading bills...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Bills 🧾</h1>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {!error && bills.length === 0 && (
        <p>No bills found.</p>
      )}

      {bills.map((bill) => (
        <div
          key={bill._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
            maxWidth: "600px",
          }}
        >
          <h2>Hospital Bill 🧾</h2>

          <p>
            <strong>Doctor:</strong>{" "}
            {bill.doctor?.name || "N/A"}
          </p>

          <p>
            <strong>Specialization:</strong>{" "}
            {bill.doctor?.specialization || "N/A"}
          </p>

          <hr />

          <p>
            Consultation Fee: ₹{bill.consultationFee}
          </p>

          <p>
            Medicine Charges: ₹{bill.medicineCharges}
          </p>

          <p>
            Lab Charges: ₹{bill.labCharges}
          </p>

          <p>
            Other Charges: ₹{bill.otherCharges}
          </p>

          <hr />

          <h2>Total: ₹{bill.totalAmount}</h2>

          <p>
            <strong>Payment Status:</strong>{" "}
            {bill.paymentStatus}
          </p>

          <p>
            <strong>Payment Method:</strong>{" "}
            {bill.paymentMethod}
          </p>

          {bill.paymentStatus === "Pending" && (
            <button
              onClick={() =>
                navigate("/pay-bill", {
                  state: { bill },
                })
              }
            >
              Pay Now 💳
            </button>
          )}

          <p>
            <strong>Bill Date:</strong>{" "}
            {new Date(bill.billDate).toLocaleDateString()}
          </p>

          {bill.description && (
            <p>
              <strong>Description:</strong>{" "}
              {bill.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Bills;