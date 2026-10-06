import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";

function PayBill() {
  const location = useLocation();
  const navigate = useNavigate();

  const bill = location.state?.bill;

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");

  if (!bill) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Bill information not found</h2>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/bills")}
          >
            Back to My Bills
          </button>
        </div>
      </div>
    );
  }

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 16);
    return numbers.replace(/(.{4})/g, "$1 ").trim();
  };

  const generateTransactionId = () => {
    const randomNumber = Math.floor(
      100000 + Math.random() * 900000
    );

    return `TXN${Date.now().toString().slice(-6)}${randomNumber}`;
  };

  const validatePayment = () => {
    if (paymentMethod === "UPI") {
      const upiPattern =
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

      if (!upiPattern.test(upiId.trim())) {
        return "Enter a valid demo UPI ID, e.g. dilip@upi";
      }
    }

    if (paymentMethod === "Card") {
      const cleanCard = cardNumber.replace(/\s/g, "");

      if (cleanCard.length !== 16) {
        return "Enter a valid 16-digit demo card number";
      }

      if (!cardName.trim()) {
        return "Enter the card holder name";
      }

      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return "Enter expiry in MM/YY format";
      }

      if (!/^\d{3}$/.test(cvv)) {
        return "Enter a valid 3-digit CVV";
      }
    }

    if (paymentMethod === "Online Banking") {
      if (!bank) {
        return "Please select a bank";
      }
    }

    return null;
  };

  const handlePayment = async () => {
    setError("");

    const validationError = validatePayment();

    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem("token");

      /*
        Demo payment processing.
        No real money is transferred.
      */
      await new Promise((resolve) =>
        setTimeout(resolve, 1800)
      );

      const response = await fetch(
        `${API}/bills/${bill._id}/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethod:
              paymentMethod === "Online Banking"
                ? "Online"
                : paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Payment failed"
        );
      }

      const txnId = generateTransactionId();

      setTransactionId(txnId);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>

          <h1 style={styles.successTitle}>
            Payment Successful
          </h1>

          <p style={styles.successText}>
            Your hospital bill has been paid successfully.
          </p>

          <div style={styles.receipt}>
            <div style={styles.receiptRow}>
              <span>Amount Paid</span>
              <strong>₹{bill.totalAmount}</strong>
            </div>

            <div style={styles.receiptRow}>
              <span>Payment Method</span>
              <strong>
                {paymentMethod === "Online Banking"
                  ? "Online"
                  : paymentMethod}
              </strong>
            </div>

            <div style={styles.receiptRow}>
              <span>Transaction ID</span>
              <strong>{transactionId}</strong>
            </div>

            <div style={styles.receiptRow}>
              <span>Status</span>
              <strong style={{ color: "#15803d" }}>
                PAID
              </strong>
            </div>
          </div>

          <p style={styles.demoNote}>
            This is a demo payment. No real money was
            transferred.
          </p>

          <button
            style={styles.primaryButton}
            onClick={() => navigate("/bills")}
          >
            View My Bills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.paymentContainer}>
        <div style={styles.header}>
          <div>
            <p style={styles.hospitalLabel}>
              HOSPITAL MANAGEMENT SYSTEM
            </p>

            <h1 style={styles.heading}>
              Secure Payment
            </h1>
          </div>

          <div style={styles.lockIcon}>🔒</div>
        </div>

        <div style={styles.amountCard}>
          <p style={styles.amountLabel}>
            Amount to Pay
          </p>

          <h2 style={styles.amount}>
            ₹{bill.totalAmount}
          </h2>

          <p style={styles.doctor}>
            Consultation with{" "}
            <strong>
              {bill.doctor?.name || "Doctor"}
            </strong>
          </p>
        </div>

        <h3 style={styles.sectionTitle}>
          Choose Payment Method
        </h3>

        <div style={styles.methods}>
          <button
            type="button"
            style={
              paymentMethod === "UPI"
                ? styles.methodActive
                : styles.method
            }
            onClick={() => {
              setPaymentMethod("UPI");
              setError("");
            }}
          >
            <span style={styles.methodIcon}>📱</span>
            <span>
              <strong>UPI</strong>
              <small>Google Pay / PhonePe / Paytm</small>
            </span>
          </button>

          <button
            type="button"
            style={
              paymentMethod === "Card"
                ? styles.methodActive
                : styles.method
            }
            onClick={() => {
              setPaymentMethod("Card");
              setError("");
            }}
          >
            <span style={styles.methodIcon}>💳</span>
            <span>
              <strong>Card</strong>
              <small>Credit / Debit Card</small>
            </span>
          </button>

          <button
            type="button"
            style={
              paymentMethod === "Online Banking"
                ? styles.methodActive
                : styles.method
            }
            onClick={() => {
              setPaymentMethod("Online Banking");
              setError("");
            }}
          >
            <span style={styles.methodIcon}>🏦</span>
            <span>
              <strong>Online Banking</strong>
              <small>Pay through your bank</small>
            </span>
          </button>
        </div>

        <div style={styles.formArea}>
          {paymentMethod === "UPI" && (
            <>
              <h3>UPI Payment</h3>

              <label style={styles.label}>
                UPI ID
              </label>

              <input
                type="text"
                value={upiId}
                onChange={(e) =>
                  setUpiId(e.target.value)
                }
                placeholder="example@upi"
                style={styles.input}
              />

              <p style={styles.helper}>
                Demo example: 9876543210@upi
              </p>
            </>
          )}

          {paymentMethod === "Card" && (
            <>
              <h3>Card Payment</h3>

              <label style={styles.label}>
                Card Number
              </label>

              <input
                type="text"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(
                    formatCardNumber(e.target.value)
                  )
                }
                placeholder="1234 5678 1234 5678"
                style={styles.input}
                maxLength="19"
              />

              <label style={styles.label}>
                Card Holder Name
              </label>

              <input
                type="text"
                value={cardName}
                onChange={(e) =>
                  setCardName(e.target.value)
                }
                placeholder="DILIP KUMAR"
                style={styles.input}
              />

              <div style={styles.cardRow}>
                <div style={styles.field}>
                  <label style={styles.label}>
                    Expiry
                  </label>

                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4)
                          .replace(
                            /(\d{2})(\d)/,
                            "$1/$2"
                          )
                      )
                    }
                    placeholder="MM/YY"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    CVV
                  </label>

                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 3)
                      )
                    }
                    placeholder="•••"
                    style={styles.input}
                    maxLength="3"
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === "Online Banking" && (
            <>
              <h3>Online Banking</h3>

              <label style={styles.label}>
                Select Your Bank
              </label>

              <select
                value={bank}
                onChange={(e) =>
                  setBank(e.target.value)
                }
                style={styles.input}
              >
                <option value="">
                  Select Bank
                </option>
                <option value="State Bank of India">
                  State Bank of India
                </option>
                <option value="HDFC Bank">
                  HDFC Bank
                </option>
                <option value="ICICI Bank">
                  ICICI Bank
                </option>
                <option value="Axis Bank">
                  Axis Bank
                </option>
                <option value="Kotak Mahindra Bank">
                  Kotak Mahindra Bank
                </option>
              </select>

              <div style={styles.bankNotice}>
                🔐 You will be redirected to a demo bank
                confirmation page.
              </div>
            </>
          )}

          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="button"
            style={
              processing
                ? styles.disabledButton
                : styles.primaryButton
            }
            onClick={handlePayment}
            disabled={processing}
          >
            {processing
              ? "Processing Payment..."
              : `Pay ₹${bill.totalAmount}`}
          </button>

          <button
            type="button"
            style={styles.cancelButton}
            onClick={() => navigate("/bills")}
            disabled={processing}
          >
            Cancel
          </button>

          <p style={styles.securityText}>
            🔒 Secure demo payment • No real money is
            transferred
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "40px 20px",
    boxSizing: "border-box",
  },

  paymentContainer: {
    maxWidth: "650px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "30px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },

  card: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  hospitalLabel: {
    fontSize: "12px",
    letterSpacing: "1px",
    color: "#64748b",
    margin: 0,
  },

  heading: {
    margin: "6px 0 0",
    fontSize: "28px",
  },

  lockIcon: {
    fontSize: "28px",
  },

  amountCard: {
    background: "#f1f5f9",
    borderRadius: "14px",
    padding: "22px",
    textAlign: "center",
    marginBottom: "28px",
  },

  amountLabel: {
    margin: 0,
    color: "#64748b",
  },

  amount: {
    fontSize: "36px",
    margin: "8px 0",
  },

  doctor: {
    margin: 0,
    color: "#475569",
  },

  sectionTitle: {
    marginBottom: "14px",
  },

  methods: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  method: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "left",
  },

  methodActive: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    background: "#eff6ff",
    border: "2px solid #2563eb",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "left",
  },

  methodIcon: {
    fontSize: "25px",
  },

  formArea: {
    marginTop: "25px",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "7px",
    marginTop: "15px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    fontSize: "15px",
    outline: "none",
  },

  helper: {
    fontSize: "13px",
    color: "#64748b",
  },

  cardRow: {
    display: "flex",
    gap: "15px",
  },

  field: {
    flex: 1,
  },

  bankNotice: {
    marginTop: "15px",
    padding: "13px",
    background: "#f8fafc",
    borderRadius: "9px",
    color: "#475569",
    fontSize: "14px",
  },

  error: {
    marginTop: "18px",
    padding: "12px",
    background: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "9px",
  },

  primaryButton: {
    width: "100%",
    marginTop: "22px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  disabledButton: {
    width: "100%",
    marginTop: "22px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#94a3b8",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
  },

  cancelButton: {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#ffffff",
    cursor: "pointer",
  },

  securityText: {
    textAlign: "center",
    fontSize: "12px",
    color: "#64748b",
    marginTop: "18px",
  },

  successCard: {
    maxWidth: "550px",
    margin: "70px auto",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },

  successIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#15803d",
    fontSize: "45px",
    lineHeight: "70px",
    fontWeight: "700",
  },

  successTitle: {
    marginBottom: "10px",
  },

  successText: {
    color: "#64748b",
  },

  receipt: {
    marginTop: "25px",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    textAlign: "left",
  },

  receiptRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0",
  },

  demoNote: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "20px",
  },

  secondaryButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
  },
};

export default PayBill;