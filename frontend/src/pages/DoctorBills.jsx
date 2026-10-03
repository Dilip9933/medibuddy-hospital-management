import { useCallback, useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function DoctorBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("doctorToken");

      const response = await fetch(`${API}/bills/doctor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bills");
      }

      setBills(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills
  }, [fetchBills]);

  const totalBills = bills.length;

  const totalAmount = bills.reduce(
    (sum, bill) => sum + Number(bill.totalAmount || 0),
    0
  );

  const paidAmount = bills
    .filter((bill) => bill.paymentStatus === "Paid")
    .reduce(
      (sum, bill) => sum + Number(bill.totalAmount || 0),
      0
    );

  const pendingAmount = bills
    .filter((bill) => bill.paymentStatus === "Pending")
    .reduce(
      (sum, bill) => sum + Number(bill.totalAmount || 0),
      0
    );

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading bills...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>Patient Bills 🧾</h1>
          <p>Manage and monitor your patients' billing status.</p>
        </div>

        <button
          onClick={fetchBills}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔄 Refresh Bills
        </button>
      </div>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3>Total Bills</h3>
          <h2>{totalBills}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3>Total Amount</h3>
          <h2>₹{totalAmount}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3>Paid Amount</h3>
          <h2>₹{paidAmount}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3>Pending Amount</h3>
          <h2>₹{pendingAmount}</h2>
        </div>
      </div>

      {!error && bills.length === 0 && (
        <p>No bills found.</p>
      )}

      {bills.map((bill) => (
        <div
          key={bill._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2>
                {bill.patient?.fullName || "Patient"}
              </h2>

              <p>
                📧 {bill.patient?.email || "No email"}
              </p>

              <p>
                📞 {bill.patient?.phone || "No phone"}
              </p>
            </div>

            <div>
              <strong>Bill Date:</strong>{" "}
              {new Date(
                bill.billDate
              ).toLocaleDateString()}
            </div>
          </div>

          <hr />

          <p>
            Consultation: ₹{bill.consultationFee}
          </p>

          <p>
            Medicines: ₹{bill.medicineCharges}
          </p>

          <p>
            Lab Charges: ₹{bill.labCharges}
          </p>

          <p>
            Other Charges: ₹{bill.otherCharges}
          </p>

          <hr />

          <h2>
            Total: ₹{bill.totalAmount}
          </h2>

          <p>
            <strong>Payment Status:</strong>{" "}
            <span
              style={{
                color:
                  bill.paymentStatus === "Paid"
                    ? "green"
                    : "orange",
                fontWeight: "bold",
              }}
            >
              {bill.paymentStatus === "Paid"
                ? "✅ PAID"
                : "⏳ PENDING"}
            </span>
          </p>

          <p>
            <strong>Payment Method:</strong>{" "}
            {bill.paymentMethod || "Not Paid"}
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

export default DoctorBills;