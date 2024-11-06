import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  VStack,
  Select,
} from "@chakra-ui/react";

const AddFamilyMember = () => {
  const [linkFormData, setLinkFormData] = useState({
    email: "",
    relationship: "",
  });

  const handleLinkInputChange = (e) => {
    const { name, value } = e.target;
    setLinkFormData({
      ...linkFormData,
      [name]: value,
    });
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = "http://localhost:8000/patient/link-family-member"; // Update with actual API endpoint
    const username = Cookies.get("username");

    const requestBody = {
      ...linkFormData,
      username,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("Family member added successfully");
      } else {
        console.error("Failed to add a family member");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }

    console.log("Linking existing patient"); // Log or handle the response appropriately
  };

  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    age: "",
    gender: "",
    relation: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = "http://localhost:8000/patient/add-family-member";
    const username = Cookies.get("username");

    const requestBody = {
      ...formData,
      username,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("Family member added successfully");
      } else {
        console.error("Failed to add a family member");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg">
          Add Family Member
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>National ID</FormLabel>
            <Input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Gender</FormLabel>
            <Input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Relation to the patient</FormLabel>
            <Input
              type="text"
              name="relation"
              value={formData.relation}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button mt={4} colorScheme="blue" type="submit">
            Add Family Member
          </Button>
        </form>
      </VStack>

      <Heading as="h3" size="md" mt={10}>
        Or Link An Existing Patient
      </Heading>
      <form onSubmit={handleLinkSubmit}>
        <FormControl isRequired mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={linkFormData.email}
            onChange={handleLinkInputChange}
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Relationship</FormLabel>
          <Select
            name="relationship"
            placeholder="Select relationship"
            value={linkFormData.relationship}
            onChange={handleLinkInputChange}
          >
            <option value="Wife">Wife</option>
            <option value="Husband">Husband</option>
            <option value="Children">Children</option>
          </Select>
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit">
          Link Existing Patient
        </Button>
      </form>
    </Box>
  );
};

export default AddFamilyMember;
