// Write me a chakra component that looks clean, it contains a text field that the doctor will write a date in and then a button that says add, the button will send a post request with the date in the body to localhost:8000/doctor/add-available-time-slot and display a toast if it was succesful or not

import { Box, Heading, Text, Button, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";

function AddAvailableTimeSlot() {
  const toast = useToast();
  const [date, setDate] = useState("");

  const handleAccept = async () => {
    // send request to server to accept contract
    // if successful, show toast
    const response = await fetch(
      "http://localhost:8000/doctor/add-available-time-slot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ date }),
      }
    );

    if (response.ok) {
      toast({
        title: "Time Slot Added.",
        description: "You have added a time slot.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={4}>Add Available Time Slot</Heading>
      <Text mb={4}>Add a time slot to your available time slots.</Text>
      <VStack spacing={4} align="stretch">
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button colorScheme="green" onClick={handleAccept}>
          Add
        </Button>
      </VStack>
    </Box>
  );
}

export default AddAvailableTimeSlot;
