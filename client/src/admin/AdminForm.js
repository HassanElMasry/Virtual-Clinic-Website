import React, { useState } from "react";

const AdminForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
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
        "http://localhost:8000/admin/add-admin",
        requestOptions
      );
      if (response.ok) {
        // Handle success
        console.log("Submission successful!");
      } else {
        // Handle error
        console.error("Submission failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <h2>Add Admin</h2>
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
            <label>Email:</label>
            <input
              type="text"
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
        </div>
        <button className="registration-form-button" type="submit">
          Add Admin
        </button>
      </form>
    </div>
  );
};

export default AdminForm;
