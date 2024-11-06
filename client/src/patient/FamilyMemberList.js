import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const FamilyMemberList = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      // Get the username from Cookies (replace 'username' with your actual cookie key)
      const username = Cookies.get("username");

      if (username) {
        try {
          const response = await fetch(
            "http://localhost:8000/patient/family-member-list",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setFamilyMembers(data.familyMembers);
          } else {
            console.error("Failed to fetch family members");
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

    fetchFamilyMembers();
  }, []);

  return (
    <div>
      <h2>Family Member List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : familyMembers && familyMembers.length > 0 ? (
        <ul>
          {familyMembers.map((familyMember, index) => (
            <li key={index}>
              Name: {familyMember.name}, Relation: {familyMember.relation}
            </li>
          ))}
        </ul>
      ) : (
        <p>No family members found.</p>
      )}
    </div>
  );
};

export default FamilyMemberList;
