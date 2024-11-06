import React, { useState, useEffect } from "react";
import axios from "axios";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors();
  }, []); // Empty dependency array to run this effect only on mount

  const getDoctors = () => {
    axios
      .get("http://localhost:8000/admin/doctor-list")
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  };

  const removeDoctor = (username) => {
    axios
      .post("http://localhost:8000/admin/remove-doctor", { username })
      .then(() => {
        // Remove the doctor from the state after successfully removing it
        setDoctors((prevDoctors) =>
          prevDoctors.filter((doctor) => doctor.username !== username)
        );
      })
      .catch((error) => {
        console.error("Error removing doctor:", error);
      });
  };

  return (
    <div>
      <h1>Doctor List</h1>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.username}>
            Username:{doctor.username}, Name: {doctor.name}
            <button onClick={() => removeDoctor(doctor.username)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorList;
