import React from "react";
import { Link } from "react-router-dom";

import { Box, VStack, Text, Divider, Icon } from "@chakra-ui/react";

function PatientSidebar() {
  return (
    <Box w="250px" bg="blue.500" color="white" px={4} py={5}>
      <VStack align="stretch" spacing={5}>
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          Menu
        </Text>
        <Divider borderColor="whiteAlpha.400" />
        <VStack align="stretch" spacing={3}>
          <Link
            to="/patient/add-family-member"
            display="flex"
            alignItems="center"
          >
            Add Family Member
          </Link>
          <Link
            display="flex"
            alignItems="center"
            to="/patient/family-member-list"
          >
            Family Members
          </Link>
          <Link
            display="flex"
            alignItems="center"
            to="/patient/prescription-list"
          >
            Prescriptions
          </Link>
          <Link
            display="flex"
            alignItems="center"
            to="/patient/appointment-list"
          >
            Appointments
          </Link>
          <Link display="flex" alignItems="center" to="/patient/doctor-list">
            Doctors
          </Link>
          <Link
            display="flex"
            alignItems="center"
            to="/patient/health-records-upload"
          >
            Health Records
          </Link>
          <Link display="flex" alignItems="center" to="/change-password">
            Change Password
          </Link>
          <Link display="flex" alignItems="center" to="/patient/packages">
            Health Packages
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
}

export default PatientSidebar;
