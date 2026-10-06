import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function DoctorLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/doctor-auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Doctor login failed");
      }

      // Store doctor authentication separately
      localStorage.setItem("doctorToken", data.token);
      localStorage.setItem("doctor", JSON.stringify(data.doctor));

      alert("Doctor login successful!");

      navigate("/doctor-dashboard");
    } catch (loginError) {
      console.error(loginError);
      setError(loginError.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container doctor-login-page">
      <h1>Doctor Login</h1>

      <p>Login to access your doctor dashboard.</p>

      {error && (
        <div className="doctor-login-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="doctor-email">Email</label>

          <input
            id="doctor-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter doctor email"
            required
          />
        </div>

        <div>
          <label htmlFor="doctor-password">Password</label>

          <input
            id="doctor-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Doctor Login"}
        </button>
      </form>
    </main>
  );
}

export default DoctorLogin;
