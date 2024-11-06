import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Checkbox,
  Input,
  Flex,
  Text,
  Button,
  Spinner,
  Heading,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { v1 as uuid } from "uuid";

const DoctorList = () => {
  const handleCall = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/create-video-room",
        {
          email: email,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        //redirect to localhost:3000/chat?roomId=<roomId> from response
        // Assuming the room ID is in the response data under the key 'roomId'
        const roomId = response.data.roomId;

        // Redirect to the new URL
        window.location.href = `http://localhost:3000/room/${roomId}`;
      }
    } catch (error) {
      console.error("Error adding:", error);
      alert("Adding Error: " + error.message); // Display error message to the user
    }
  };

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    filterOn: false,
    name: "",
    specialty: "",
    date: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/patient/doctor-list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(filter),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors);
      } else {
        console.error("Failed to fetch doctors");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
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

  const handleShowDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleSchedule = async (doctor, appIndex) => {
    try {
      const response = await fetch(
        "http://localhost:8000/patient/schedule-appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ doctor: doctor, index: appIndex }),
        }
      );

      console.log({ doctor, appIndex });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        fetchDoctors();
      } else {
        console.error("Failed to schedule appointment");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleChat = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/create-chat-room",
        {
          email: email,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        //redirect to localhost:3000/chat?roomId=<roomId> from response
        // Assuming the room ID is in the response data under the key 'roomId'
        const roomId = response.data.roomId;

        // Redirect to the new URL
        window.location.href = `http://localhost:3000/chat?roomId=${roomId}`;
      }
    } catch (error) {
      console.error("Error adding:", error);
      alert("Adding Error: " + error.message); // Display error message to the user
    }
  };

  const cardBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box p={4}>
      <Heading mb={6}>Doctor List</Heading>

      <Flex wrap="wrap" mb={6} gap={4}>
        <Checkbox
          isChecked={filter.filterOn}
          onChange={handleFilterChange}
          name="filterOn"
        >
          Filters
        </Checkbox>
        <Flex align="center">
          <Text mr={2}>Name:</Text>
          <Input
            name="name"
            value={filter.name}
            onChange={handleFilterChange}
          />
        </Flex>
        <Flex align="center">
          <Text mr={2}>Specialty:</Text>
          <Input
            name="specialty"
            value={filter.specialty}
            onChange={handleFilterChange}
          />
        </Flex>
        <Flex align="center">
          <Text mr={2}>Available On:</Text>
          <Input
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
          />
        </Flex>
      </Flex>

      {loading ? (
        <Spinner />
      ) : doctors && doctors.length > 0 ? (
        <Flex direction="column" gap={4}>
          {doctors.map((doctor, index) => (
            <Box key={index} p={4} bg={cardBg} borderRadius="md" shadow="md">
              <Text>
                Doctor Name: {doctor.name}, Specialty: {doctor.education.degree}
              </Text>
              <Button mt={2} onClick={() => handleShowDoctorDetails(doctor)}>
                Show Details
              </Button>
              <Button
                colorScheme="green"
                onClick={() => handleChat(doctor.email)}
              >
                Chat
              </Button>
              <Button
                colorScheme="green"
                onClick={() => handleCall(doctor.email)}
              >
                Video Call
              </Button>
              <VStack mt={4} spacing={2}>
                {doctor.availableTimeSlots.map((slot, appIndex) => (
                  <Button
                    key={appIndex}
                    onClick={() => handleSchedule(doctor.username, appIndex)}
                  >
                    Schedule for {slot.date}
                  </Button>
                ))}
              </VStack>
            </Box>
          ))}
        </Flex>
      ) : (
        <Text>No doctors found.</Text>
      )}

      {selectedDoctor && (
        <Box mt={6}>
          <Heading size="md">Selected Doctor Details</Heading>
          <pre>{JSON.stringify(selectedDoctor, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default DoctorList;
