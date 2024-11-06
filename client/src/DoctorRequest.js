import React, { useState } from "react";

import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Box,
  Heading,
  Container,
} from "@chakra-ui/react";

const DoctorRequest = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
    dob: "",
    hourlyRate: "",
    affiliation: "",
    education: {
      degree: "",
      university: "",
    },
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    updateFileSelection(newFiles);
  };

  const updateFileSelection = (newFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    const newFileNames = newFiles.map((file) => file.name);
    setSelectedFileNames((prevFileNames) => [
      ...prevFileNames,
      ...newFileNames,
    ]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEducationChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      education: {
        ...formData.education,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();

    // Append text fields to formDataToSend
    for (const key in formData) {
      if (key !== "education") {
        formDataToSend.append(key, formData[key]);
      }
    }

    if (formData.education) {
      formDataToSend.append("education", JSON.stringify(formData.education));
    }

    console.log(selectedFiles.length);
    // Append files
    selectedFiles.forEach((file) => {
      formDataToSend.append("files", file);
    });

    const requestOptions = {
      method: "POST",
      body: formDataToSend,
      // Do not set the Content-Type header
    };

    try {
      console.log(requestOptions.body);
      const response = await fetch(
        "http://localhost:8000/submit-doctor-request",
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
    <Box p={5}>
      <Heading mb={5}>Doctor Request Form</Heading>
      <Container maxW="lg" p={5}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            {/* Username Field */}
            <FormControl isRequired>
              <FormLabel>Username:</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </FormControl>

            {/* Name Field */}
            <FormControl isRequired>
              <FormLabel>Name:</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </FormControl>

            {/* Email Field */}
            <FormControl isRequired>
              <FormLabel>Email:</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>

            {/* Password Field */}
            <FormControl isRequired>
              <FormLabel>Password:</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </FormControl>

            {/* Affiliation Field */}
            <FormControl isRequired>
              <FormLabel>Affiliation:</FormLabel>
              <Input
                type="text"
                name="affiliation"
                value={formData.affiliation}
                onChange={handleInputChange}
              />
            </FormControl>

            {/* DOB Field */}
            <FormControl isRequired>
              <FormLabel>Date of Birth:</FormLabel>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </FormControl>

            {/* Hourly Rate Field */}
            <FormControl isRequired>
              <FormLabel>Hourly Rate:</FormLabel>
              <Input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
              />
            </FormControl>

            {/* Education Degree Field */}
            <FormControl isRequired>
              <FormLabel>Education Degree:</FormLabel>
              <Input
                type="text"
                name="degree"
                value={formData.education.degree}
                onChange={handleEducationChange}
              />
            </FormControl>

            {/* Education University Field */}
            <FormControl isRequired>
              <FormLabel>Education University:</FormLabel>
              <Input
                type="text"
                name="university"
                value={formData.education.university}
                onChange={handleEducationChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Upload Required Files:</FormLabel>
              <Input
                type="file"
                name="fileUpload"
                onChange={handleFileChange}
                p={1}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple // This should allow multiple file selections
              />
              {/* Display selected file names */}
              <Box mt={2}>
                {selectedFileNames.map((name, index) => (
                  <Box key={index}>{name}</Box>
                ))}
              </Box>
            </FormControl>

            {/* Submit Button */}
            <Button colorScheme="blue" type="submit">
              Submit
            </Button>
          </VStack>
        </form>
      </Container>
    </Box>
  );
};

export default DoctorRequest;
