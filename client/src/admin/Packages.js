import React, { useState, useEffect } from "react";
import axios from "axios";

function Packages() {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({
    name: "",
    price: 0,
    doctorDiscount: 0,
    medicineDiscount: 0,
    familyDiscount: 0,
  });
  const [editPackage, setEditPackage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/packages")
      .then((response) => setPackages(response.data))
      .catch((error) =>
        console.error("Error fetching health packages:", error)
      );
  }, []);

  const addPackage = () => {
    if (
      newPackage.name &&
      newPackage.price > 0 &&
      newPackage.doctorDiscount >= 0 &&
      newPackage.medicineDiscount >= 0 &&
      newPackage.familyDiscount >= 0
    ) {
      axios
        .post("http://localhost:8000/admin/add-package", newPackage)
        .then(() => {
          setPackages([...packages, { ...newPackage }]);
          setNewPackage({
            name: "",
            price: 0,
            doctorDiscount: 0,
            medicineDiscount: 0,
            familyDiscount: 0,
          });
        })
        .catch((error) => console.error("Error adding health package:", error));
    }
  };

  const updatePackage = () => {
    if (editPackage) {
      axios
        .post("http://localhost:8000/admin/update-package", newPackage)
        .then(() => {
          const updatedPackages = packages.map((packageItem) =>
            packageItem === editPackage ? newPackage : packageItem
          );
          setPackages(updatedPackages);
          setEditPackage(null);
          setNewPackage({
            name: "",
            price: 0,
            doctorDiscount: 0,
            medicineDiscount: 0,
            familyDiscount: 0,
          });
        })
        .catch((error) =>
          console.error("Error updating health package:", error)
        );
    }
  };

  const deletePackage = (packageToDelete) => {
    axios
      .post("http://localhost:8000/admin/delete-package", {
        name: packageToDelete.name,
      })
      .then(() => {
        const updatedPackages = packages.filter(
          (packageItem) => packageItem !== packageToDelete
        );
        setPackages(updatedPackages);
      })
      .catch((error) => console.error("Error deleting health package:", error));
  };

  const handleEditClick = (packageToEdit) => {
    setEditPackage(packageToEdit);
    setNewPackage({ ...packageToEdit });
  };

  return (
    <div>
      <h1>Health Packages</h1>
      <div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Package Name"
            value={newPackage.name}
            onChange={(e) =>
              setNewPackage({ ...newPackage, name: e.target.value })
            }
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            placeholder="Price"
            value={newPackage.price}
            onChange={(e) =>
              setNewPackage({
                ...newPackage,
                price: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label>Doctor Discount:</label>
          <input
            type="number"
            placeholder="Doctor Discount"
            value={newPackage.doctorDiscount}
            onChange={(e) =>
              setNewPackage({
                ...newPackage,
                doctorDiscount: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label>Medicine Discount:</label>
          <input
            type="number"
            placeholder="Medicine Discount"
            value={newPackage.medicineDiscount}
            onChange={(e) =>
              setNewPackage({
                ...newPackage,
                medicineDiscount: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label>Family Discount:</label>
          <input
            type="number"
            placeholder="Family Discount"
            value={newPackage.familyDiscount}
            onChange={(e) =>
              setNewPackage({
                ...newPackage,
                familyDiscount: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <button onClick={editPackage ? updatePackage : addPackage}>
          {editPackage ? "Update Package" : "Add Package"}
        </button>
      </div>
      <ul>
        {packages.map((packageItem) => (
          <li key={packageItem.name}>
            <span>
              {packageItem.name} - Price: ${packageItem.price}
            </span>
            <button onClick={() => handleEditClick(packageItem)}>Edit</button>
            <button onClick={() => deletePackage(packageItem)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Packages;
