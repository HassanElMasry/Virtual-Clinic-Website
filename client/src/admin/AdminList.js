import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminList() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    getAdmins();
  }, []); // Empty dependency array to run this effect only on mount

  const getAdmins = () => {
    axios
      .get("http://localhost:8000/admin/admin-list")
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((error) => {
        console.error("Error fetching admins:", error);
      });
  };

  const removeAdmin = (username) => {
    axios
      .post("http://localhost:8000/admin/remove-admin", { username })
      .then(() => {
        // Remove the admin from the state after successfully removing it
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin.username !== username)
        );
      })
      .catch((error) => {
        console.error("Error removing admin:", error);
      });
  };

  return (
    <div>
      <h1>Admin List</h1>
      <ul>
        {admins.map((admin) => (
          <li key={admin.username}>
            {admin.username}
            <button onClick={() => removeAdmin(admin.username)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminList;
