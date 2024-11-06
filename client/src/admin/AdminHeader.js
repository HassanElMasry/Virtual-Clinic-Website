import React from "react";
import { Flex, Box, Text, IconButton, HStack, Button } from "@chakra-ui/react";
import { BellIcon, SettingsIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";

const AdminHeader = () => {
  const handleLogout = async () => {
    const response = await fetch("http://localhost:8000/logout", {
      method: "POST", // or 'GET', depending on your backend
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    Cookies.remove("token");
    window.location.href = "/";
  };

  return (
    <Flex
      as="header"
      align="center"
      justify="center"
      wrap="wrap"
      w="100%"
      p={5}
      bg="blue.600"
      color="white"
    >
      {/* Logo or Title */}
      <Box flexShrink={0}>
        <Text fontSize="35px" fontWeight="bold">
          Welcome
        </Text>
      </Box>

      {/* Left-side Links or Navigation (optional) */}
      <HStack spacing={8} align="center" display={{ base: "none", md: "flex" }}>
        {/* Navigation links here */}
      </HStack>

      {/* Right-side Icons */}
      <Box position="absolute" right="16px">
        <IconButton
          icon={<BellIcon />}
          aria-label="Notifications"
          variant="ghost"
          color="whiteAlpha.900"
          mr={2}
        />
        <IconButton
          icon={<SettingsIcon />}
          aria-label="Settings"
          variant="ghost"
          color="whiteAlpha.900"
        />
        <Button size="sm" colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Flex>
  );
};

export default AdminHeader;
