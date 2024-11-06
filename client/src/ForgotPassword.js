import React, { useState } from "react";
import {
  Button,
  Input,
  VStack,
  Box,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const requestPasswordReset = async () => {
    try {
      const response = await fetch("http://localhost:8000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        toast({
          title: "Password reset requested",
          description: "Please check your email for the OTP.",
          status: "success",
        });
        onOpen(); // Open the modal after sending the request
      } else {
        toast({
          title: "Failed to request password reset",
          description: "Please try again later.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "An error occurred",
        description: "Unable to request password reset.",
        status: "error",
      });
    }
  };

  const handlePasswordReset = async () => {
    try {
      const response = await fetch("http://localhost:8000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, newPassword, otp }),
      });

      if (response.ok) {
        toast({
          title: "Password Reset Successful",
          description:
            "Your password has been updated. Please log in with your new password.",
          status: "success",
        });
        onClose(); // Close the modal
        // Optionally reset the state or redirect the user to the login page
      } else {
        const errorMsg = await response.text();
        toast({
          title: "Failed to Reset Password",
          description: errorMsg,
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "An error occurred",
        description: "Unable to reset password.",
        status: "error",
      });
    }
  };

  return (
    <VStack spacing={4}>
      <Input
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button onClick={requestPasswordReset}>Reset Password</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Your Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Enter new password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePasswordReset}>
              Confirm Reset
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ForgotPassword;
