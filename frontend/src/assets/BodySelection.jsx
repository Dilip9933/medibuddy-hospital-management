import { useState } from "react";
import doctors from "./doctors";
import bodyImage from "./body.png";

function BodySelection() {
  const [selectedPart, setSelectedPart] = useState(null);

  const selectedData = selectedPart ? doctors[selectedPart] : null;

  return (
    <div className="body-selection">

      <h1>Find the Right Specialist</h1>

      <p>Select the area where you need medical attention.</p>

      <div className="body-container">

        <img
          src={bodyImage}
          alt="Human body"
          className="body-image"
        />

        {/* CLICKABLE BUTTONS */}

        <button
          className="body-area head-area"
          onClick={() => setSelectedPart("head")}
        >
          HEAD
        </button>

        <button
          className="body-area chest-area"
          onClick={() => setSelectedPart("chest")}
        >
          CHEST
        </button>

        <button
          className="body-area stomach-area"
          onClick={() => setSelectedPart("stomach")}
        >
          STOMACH
        </button>

        <button
          className="body-area bones-area"
          onClick={() => setSelectedPart("bones")}
        >
          BONES
        </button>

        <button
          className="body-area eyes-area"
          onClick={() => setSelectedPart("eyes")}
        >
          EYES
        </button>

      </div>

      {/* DOCTORS */}

      {selectedData && (
        <div className="doctor-section">

          <h2>{selectedData.department}</h2>

          <p>
            Available doctors for this department:
          </p>

          <div className="doctor-list">

            {selectedData.doctors.map((doctor, index) => (

              <div className="doctor-card" key={index}>

                <h3>{doctor.name}</h3>

                <p>
                  <strong>Specialization:</strong>{" "}
                  {doctor.specialization}
                </p>

                <p>
                  <strong>Qualification:</strong>{" "}
                  {doctor.qualification}
                </p>

                <p>
                  <strong>Experience:</strong>{" "}
                  {doctor.experience}
                </p>

                <button className="doctor-button">
                  View Doctor
                </button>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default BodySelection;