import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Checkbox,
  Input,
  Text,
  Spinner,
  Heading,
  List,
  ListItem,
  ListIcon,
  Flex,
  useColorModeValue,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const FollowUps = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAccept = async (id) => {
    // Send the inputValue to wherever you need it
    try {
      const response = await axios.post(
        "http://localhost:8000/doctor/accept-follow-up",
        {
          requestId: id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        window.location.reload();
        alert("Follow up accepted.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(" Error: " + error.message); // Display error message to the user
    }
  };

  const handleReject = async (id) => {
    // Send the inputValue to wherever you need it
    try {
      const response = await axios.post(
        "http://localhost:8000/doctor/reject-follow-up",
        {
          requestId: id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        window.location.reload();
        alert("Follow up rejected.");
      }
    } catch (error) {
      console.error("Error :", error);
      alert("Followup : " + error.message); // Display error message to the user
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/doctor/follow-up-list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.requests);
          setRequests(data.requests);
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const cardBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box p={4}>
      <Heading mb={6}>Follow Up Requests List</Heading>

      {loading ? (
        <Spinner />
      ) : requests && requests.length > 0 ? (
        <List spacing={3}>
          {requests.map((request, index) => (
            <ListItem
              key={index}
              bg={cardBg}
              p={4}
              borderRadius="md"
              shadow="md"
            >
              <Flex alignItems="center" justifyContent="space-between">
                <Text>Patient Name: {request.patientName}</Text>
              </Flex>
              <Text>Date: {request.date}</Text>
              <Button
                colorScheme="blue"
                onClick={() => handleAccept(request._id)}
              >
                Accept
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleReject(request._id)}
              >
                Reject
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text>No requests found.</Text>
      )}
    </Box>
  );
};

export default FollowUps;
