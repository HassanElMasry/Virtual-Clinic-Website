import React, { useState } from "react";
import Cookies from "js-cookie";

function DoctorEdit() {
  const [email, setEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [affiliation, setAffiliation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = Cookies.get("username");
    const updatedData = {
      username: username,
      email: email,
      hourlyRate: hourlyRate,
      affiliation: affiliation,
    };

    // Send the updated data to the backend API using a POST request
    fetch("http://localhost:8000/doctor/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    }).then((response) => {
      if (response.ok) {
        // Handle success, e.g., display a success message
        console.log("Profile updated successfully.");
      } else {
        // Handle errors, e.g., show an error message
        console.error("Failed to update profile.");
      }
    });
  };

  return (
    <div>
      <h2>Edit Doctor Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Hourly Rate:</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>
        <div>
          <label>Affiliation (Hospital):</label>
          <input
            type="text"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default DoctorEdit;
