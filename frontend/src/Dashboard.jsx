import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-welcome">WELCOME BACK</p>
          <h1>Hospital Dashboard</h1>
          <p>Manage your hospital activities from one place.</p>
        </div>

        <div className="dashboard-user">
          👤 Admin
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-container">

        <div className="stat-card">
          <span>👨‍⚕️</span>
          <div>
            <h3>24</h3>
            <p>Doctors</p>
          </div>
        </div>

        <div className="stat-card">
          <span>🧑‍🤝‍🧑</span>
          <div>
            <h3>156</h3>
            <p>Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <span>📅</span>
          <div>
            <h3>32</h3>
            <p>Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <span>💰</span>
          <div>
            <h3>₹45,600</h3>
            <p>Total Revenue</p>
          </div>
        </div>

      </div>

      {/* Modules */}
      <div className="dashboard-section">

        <p className="section-title">HOSPITAL MANAGEMENT</p>

        <h2>Manage Your Hospital</h2>

        <div className="module-container">

          <Link to="/doctors" className="module-card">
            <span>👨‍⚕️</span>
            <h3>Doctors</h3>
            <p>Manage doctors and their availability.</p>
          </Link>

          <Link to="/patients" className="module-card">
            <span>🧑‍🤝‍🧑</span>
            <h3>Patients</h3>
            <p>Manage patient information and records.</p>
          </Link>

          <Link to="/appointments" className="module-card">
            <span>📅</span>
            <h3>Appointments</h3>
            <p>Book and manage appointments.</p>
          </Link>

          <Link to="/pharmacy" className="module-card">
            <span>💊</span>
            <h3>Pharmacy</h3>
            <p>Manage medicines and pharmacy stock.</p>
          </Link>

          <Link to="/billing" className="module-card">
            <span>🧾</span>
            <h3>Billing</h3>
            <p>Create and manage patient bills.</p>
          </Link>

          <Link to="/payments" className="module-card">
            <span>💳</span>
            <h3>Payments</h3>
            <p>Manage payments and payment history.</p>
          </Link>

          <Link to="/medical-records" className="module-card">
            <span>📋</span>
            <h3>Medical Records</h3>
            <p>View and manage patient medical records.</p>
          </Link>

          <Link to="/reports" className="module-card">
            <span>📊</span>
            <h3>Reports</h3>
            <p>View hospital reports and statistics.</p>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;