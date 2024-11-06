import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
} from "@chakra-ui/react";
import {
  Box,
  Checkbox,
  Input,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  List,
  ListItem,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    filterOn: false,
    name: "",
    date: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [followUpDate, setFollowUpDate] = useState("");

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    const newFileNames = newFiles.map((file) => file.name);
    setSelectedFileNames((prevFileNames) => [
      ...prevFileNames,
      ...newFileNames,
    ]);
  };

  const handleScheduleFollowUp = (patient) => {
    setSelectedPatient(patient);
    onOpen();
  };

  const handleAddFollowUp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/doctor/schedule-followup",
        {
          username: selectedPatient.username,
          date: followUpDate,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      // Handle success response
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      // Handle error response
    }
    onClose();
  };

  const handleUploadHealthRecord = async (username) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("username", username);

    try {
      const response = await fetch(
        "http://localhost:8000/doctor/upload-health-record-for-patient",
        {
          method: "POST",
          body: formData, // FormData will be sent as 'multipart/form-data'
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Files uploaded successfully");
        fetchPatients();
      } else {
        console.error("Failed to upload files");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const fetchPatients = async () => {
    // Get the username from Cookies (replace 'username' with your actual cookie key)

    try {
      const response = await fetch(
        "http://localhost:8000/doctor/patient-list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ filter }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.patients);
        setPatients(data.patients);
      } else {
        console.error("Failed to fetch patients");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
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

  const previewFile = (file) => {
    try {
      // Assuming file.data is a Base64 encoded string
      const base64String = file.data;

      // Decoding the Base64 string to a Blob
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.mimetype });

      // Creating a Blob URL and opening it
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error in creating preview:", error);
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

  return (
    <VStack spacing={4} align="stretch">
      <Heading as="h2">Patient List</Heading>
      <Box as="form">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="filterOn" mb="0">
            Filters:
          </FormLabel>
          <Checkbox
            id="filterOn"
            name="filterOn"
            isChecked={filter.filterOn}
            onChange={handleFilterChange}
          />
        </FormControl>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="name">Name:</FormLabel>
            <Input
              id="name"
              type="text"
              name="name"
              value={filter.name}
              onChange={handleFilterChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="date">Appointment On:</FormLabel>
            <Input
              id="date"
              type="text"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
            />
          </FormControl>
        </HStack>
      </Box>

      {loading ? (
        <Text>Loading...</Text>
      ) : patients && patients.length > 0 ? (
        <List>
          {patients.map((patient, index) => (
            <ListItem
              key={patient.id}
              d="flex"
              justifyContent="space-between"
              alignItems="center"
              w="full"
            >
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="lg"
                mb={4}
                w="full"
                bg="gray.50"
              >
                <VStack spacing={4} align="left">
                  <Box bg="gray.100" p={2} borderRadius="md">
                    <Heading size="md">Patient Name: {patient.name}</Heading>
                  </Box>
                  <Divider />

                  <Heading size="sm" alignSelf="flex-start">
                    Health Records
                  </Heading>
                  <HStack spacing={2}>
                    {patient.files.map((file, fileIndex) => (
                      <Button
                        key={fileIndex}
                        size="sm"
                        onClick={() => previewFile(file)}
                      >
                        Preview {file.filename}
                      </Button>
                    ))}
                  </HStack>
                  <Divider />
                  <HStack>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleScheduleFollowUp(patient)}
                      maxWidth="200px" // Adjust as needed
                    >
                      Schedule Follow-up
                    </Button>
                  </HStack>
                  <Divider />

                  <Heading size="sm" alignSelf="flex-start">
                    Upload New Health Record
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    <FormControl maxWidth="300px">
                      {" "}
                      {/* Adjust as needed */}
                      <FormLabel htmlFor={`file-upload-${patient.id}`}>
                        Select health records (multiple allowed):
                      </FormLabel>
                      <Input
                        id={`file-upload-${patient.id}`}
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </FormControl>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => handleUploadHealthRecord(patient.username)}
                      width="fit-content" // Adjust as needed
                    >
                      Upload Health Record
                    </Button>
                    <Button
                      colorScheme="green"
                      onClick={() => handleChat(patient.email)}
                    >
                      Chat
                    </Button>
                    <Button
                      colorScheme="green"
                      onClick={() => handleCall(patient.email)}
                    >
                      Video Call
                    </Button>
                  </VStack>
                </VStack>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text>No patients found.</Text>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Follow-up</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Date for Follow-up</FormLabel>
              <Input
                placeholder="Enter date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddFollowUp}>
              Add
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default PatientList;
