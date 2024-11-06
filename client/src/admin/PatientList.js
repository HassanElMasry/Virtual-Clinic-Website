import React, { useState, useEffect } from "react";
import axios from "axios";

function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatients();
  }, []); // Empty dependency array to run this effect only on mount

  const getPatients = () => {
    axios
      .get("http://localhost:8000/admin/patient-list")
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  };

  const removePatient = (username) => {
    axios
      .post("http://localhost:8000/admin/remove-patient", { username })
      .then(() => {
        // Remove the patient from the state after successfully removing it
        setPatients((prevPatients) =>
          prevPatients.filter((patient) => patient.username !== username)
        );
      })
      .catch((error) => {
        console.error("Error removing patient:", error);
      });
  };

  return (
    <div>
      <h1>Patient List</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient.username}>
            Username: {patient.username}, Name: {patient.name}
            <button onClick={() => removePatient(patient.username)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientList;
