import React from "react";
import { Link } from "react-router-dom";

import { Box, VStack, Text, Divider, Icon } from "@chakra-ui/react";

function DoctorSidebar() {
  return (
    <Box w="250px" bg="blue.500" color="white" px={4} py={5}>
      <VStack align="stretch" spacing={5}>
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          Menu
        </Text>
        <Divider borderColor="whiteAlpha.400" />
        <VStack align="stretch" spacing={3}>
          <Link
            to="/doctor/appointment-list"
            display="flex"
            alignItems="center"
          >
            Appointments
          </Link>
          <Link display="flex" alignItems="center" to="/doctor/edit">
            Edit Info
          </Link>
          <Link display="flex" alignItems="center" to="/doctor/patient-list">
            Patients
          </Link>
          <Link display="flex" alignItems="center" to="/change-password">
            Change Password
          </Link>
          <Link
            display="flex"
            alignItems="center"
            to="/doctor/employment-contract"
          >
            View Contract
          </Link>
          <Link
            display="flex"
            alignItems="center"
            to="/doctor/add-available-time-slot"
          >
            Add Available Time Slot
          </Link>
          <Link display="flex" alignItems="center" to="/doctor/follow-up-list">
            Follow Up Requests
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
}

export default DoctorSidebar;
