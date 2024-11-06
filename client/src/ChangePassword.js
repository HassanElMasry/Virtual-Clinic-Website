import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/change-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        toast({ title: "Password changed successfully", status: "success" });
        // Additional logic to handle user logout or redirection
      } else {
        toast({ title: "Failed to change password", status: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "An error occurred", status: "error" });
    }
  };

  return (
    <Box p={5}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>New Password:</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Change Password
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ChangePassword;
