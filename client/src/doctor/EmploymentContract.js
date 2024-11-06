import React from "react";
import { Box, Heading, Text, Button, VStack, useToast } from "@chakra-ui/react";

function EmploymentContract() {
  const toast = useToast();

  const handleAccept = async () => {
    // send request to server to accept contract
    // if successful, show toast
    const response = await fetch(
      "http://localhost:8000/doctor/accept-contract",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      toast({
        title: "Contract Accepted.",
        description: "You have accepted the employment contract.",
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
      <Heading mb={4}>Employment Contract</Heading>
      <Text mb={4}>
        This Employment Contract (the "Contract") is entered into as of [Date]
        by and between [Your Company Name], a [Your State] Corporation
        ("Company"), and [Employee Name] ("Employee"). The Company hereby
        employs Employee, and Employee hereby accepts employment with the
        Company, on the terms and subject to the conditions set forth in this
        Contract...
        {/* Add more filler text as needed */}
      </Text>
      <Text>MARKUP:10%</Text>
      <VStack spacing={4} align="stretch">
        <Button colorScheme="green" onClick={handleAccept}>
          Accept
        </Button>
      </VStack>
    </Box>
  );
}

export default EmploymentContract;
