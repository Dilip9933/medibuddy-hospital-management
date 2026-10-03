function Patients() {
  return (
    <div className="page-container">

      <h1>Patient Management</h1>

      <p>Manage patient information and records.</p>

      <div className="form-card">

        <h2>Add Patient</h2>

        <form>

          <label>Patient Name</label>
          <input
            type="text"
            placeholder="Enter patient name"
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter patient email"
          />

          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter phone number"
          />

          <label>Age</label>
          <input
            type="number"
            placeholder="Enter age"
          />

          <button type="submit" className="primary-btn">
            Add Patient
          </button>

        </form>

      </div>

    </div>
  );
}

export default Patients;