import React, { useState } from "react";

import "./RegistrationForm.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
    dob: "",
    gender: "male",
    mobile: "",
    emergencyContact: {
      name: "",
      mobile: "",
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEmergencyContactChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      emergencyContact: {
        ...formData.emergencyContact,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    try {
      console.log(requestOptions.body);
      const response = await fetch(
        "http://localhost:8000/register-patient",
        requestOptions
      );
      if (response.ok) {
        // Handle success
        console.log("Registration successful!");
      } else {
        // Handle error
        console.error("Registration failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <h2>Patient Registration Form</h2>
      <form className="registration-form-container" onSubmit={handleSubmit}>
        <div className="registration-form-field">
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label>Mobile:</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Emergency Contact Name:</label>
            <input
              type="text"
              name="name"
              value={formData.emergencyContact.name}
              onChange={handleEmergencyContactChange}
              required
            />
          </div>
          <div>
            <label>Emergency Contact Mobile:</label>
            <input
              type="tel"
              name="mobile"
              value={formData.emergencyContact.mobile}
              onChange={handleEmergencyContactChange}
              required
            />
          </div>
        </div>
        <button className="registration-form-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
