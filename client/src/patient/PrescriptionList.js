import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    filterOn: false,
    date: "",
    doctor: "",
    filled: null,
    unfilled: null, // Use null to indicate "any" by default
  });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      // Get the username from Cookies (replace 'username' with your actual cookie key)
      const username = Cookies.get("username");

      if (username) {
        try {
          const response = await fetch(
            "http://localhost:8000/patient/prescription-list",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, ...filter }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setPrescriptions(data.prescriptions);
          } else {
            console.error("Failed to fetch prescriptions");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Username not found in cookies");
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [filter]);

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setFilter({
        ...filter,
        [name]: checked ? true : null,
      });
      console.log(filter);
    } else {
      setFilter({
        ...filter,
        [name]: value,
      });
    }
  };

  return (
    <div>
      <h2>Prescription List</h2>
      <form>
        <label>
          Filters:
          <input
            type="checkbox"
            name="filterOn"
            checked={filter.filterOn}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Date:
          <input
            type="text"
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          Doctor:
          <input
            type="text"
            name="doctor"
            value={filter.doctor}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          Filled:
          <input
            type="checkbox"
            name="filled"
            checked={filter.filled}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Unfilled:
          <input
            type="checkbox"
            name="unfilled"
            checked={filter.unfilled}
            onChange={handleFilterChange}
          />
        </label>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : prescriptions && prescriptions.length > 0 ? (
        <ul>
          {prescriptions.map((prescription, index) => (
            <li key={index}>
              Name: {prescription.name}, Dosage: {prescription.dose}, Doctor
              Name: {prescription.doctor.name}, Filled:{" "}
              {prescription.filled == true ? "Yes" : "No"}, Date:{" "}
              {prescription.date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No prescriptions found.</p>
      )}
    </div>
  );
};

export default PrescriptionList;
