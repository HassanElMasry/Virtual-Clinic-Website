import React, { useState, useEffect } from "react";
import axios from "axios";

function RequestList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getRequests();
  }, []); // Empty dependency array to run this effect only on mount

  const getRequests = () => {
    axios
      .get("http://localhost:8000/admin/request-list")
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
      });
  };

  const acceptRequest = (username) => {
    axios
      .post("http://localhost:8000/admin/accept-request", { username })
      .then(() => {
        // Remove the request from the state after successfully accepting it
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.username !== username)
        );
      })
      .catch((error) => {
        console.error("Error removing request:", error);
      });
  };

  const removeRequest = (username) => {
    axios
      .post("http://localhost:8000/admin/remove-request", { username })
      .then(() => {
        // Remove the request from the state after successfully removing it
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.username !== username)
        );
      })
      .catch((error) => {
        console.error("Error removing request:", error);
      });
  };

  return (
    <div>
      <h1>Request List</h1>
      <ul>
        {requests.map((request) => (
          <li key={request.username}>
            Username:{request.username}, Name:{request.name}, Email:{" "}
            {request.email}, DOB: {request.dob}, Hourly Rate:{" "}
            {request.hourlyRate}, Affiliation: {request.affiliation}, Education:{" "}
            {request.education.degree} {request.education.university}
            <button onClick={() => acceptRequest(request.username)}>
              Accept
            </button>
            <button onClick={() => removeRequest(request.username)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RequestList;
