import { React, useEffect, useState } from "react";
import { Flex, Box, Text, IconButton, HStack, Button } from "@chakra-ui/react";
import { BellIcon, SettingsIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";

const DoctorHeader = () => {
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    // fetch wallet field from localhost:8000/patient/get-wallet
    // setWallet(wallet);
    const fetchWallet = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/doctor/get-wallet",
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
          console.log(data.wallet);
          setWallet(data.wallet);
        } else {
          console.error("Failed to fetch wallet");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchWallet();
  }, []);
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
          Doctor Portal
        </Text>
      </Box>

      {/* Left-side Links or Navigation (optional) */}
      <HStack spacing={8} align="center" display={{ base: "none", md: "flex" }}>
        {/* Navigation links here */}
      </HStack>

      {/* Right-side Icons */}
      <Box position="absolute" right="16px">
        <Text fontSize="lg" fontWeight="bold">
          Wallet: {wallet}
        </Text>
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

export default DoctorHeader;
