import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  List,
  ListItem,
} from "@chakra-ui/react";

const HealthRecordsUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);

  const fetchHealthRecords = async () => {
    try {
      // Replace 'currentUsername' with the actual username
      const response = await fetch(
        `http://localhost:8000/patient/get-health-records`,
        { credentials: "include", method: "POST" }
      );
      if (response.ok) {
        const records = await response.json();
        setHealthRecords(records);
      }
    } catch (error) {
      console.error("Error fetching health records:", error);
    }
  };

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const previewFile = (record) => {
    console.log(record);
    // Create a Blob from the Base64 string
    const byteCharacters = atob(record.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const fileBlob = new Blob([byteArray], { type: record.mimetype });

    // Create a URL for the Blob and open it
    const blobUrl = URL.createObjectURL(fileBlob);
    window.open(blobUrl, "_blank");
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    const newFileNames = newFiles.map((file) => file.name);
    setSelectedFileNames((prevFileNames) => [
      ...prevFileNames,
      ...newFileNames,
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        "http://localhost:8000/patient/health-records-upload",
        {
          method: "POST",
          body: formData, // FormData will be sent as 'multipart/form-data'
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Files uploaded successfully");
        // Clear the selections
        setSelectedFiles([]);
        setSelectedFileNames([]);
        fetchHealthRecords();
      } else {
        console.error("Failed to upload files");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Container centerContent p={5}>
      <Heading mb={5}>Health Records</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="file-upload">
              Select health records (multiple allowed):
            </FormLabel>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </FormControl>

          {selectedFileNames.length > 0 && (
            <Box w="100%" p={2} borderWidth="1px" borderRadius="lg">
              <Heading size="sm" mb={2}>
                Selected Files:
              </Heading>
              <List spacing={2}>
                {selectedFileNames.map((name, index) => (
                  <ListItem key={index}>{name}</ListItem>
                ))}
              </List>
            </Box>
          )}

          <Button colorScheme="blue" type="submit">
            Upload Files
          </Button>
          <Box w="100%" p={2} borderWidth="1px" borderRadius="lg">
            <Heading size="sm" mb={2}>
              Uploaded Health Records:
            </Heading>
            <List spacing={2}>
              {healthRecords.map((record, index) => (
                <ListItem key={index}>
                  {record.filename}
                  <Button
                    ml={4}
                    onClick={() => previewFile(record)} // Use previewFile function for preview
                  >
                    Preview
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        </VStack>
      </form>
    </Container>
  );
};

export default HealthRecordsUpload;
