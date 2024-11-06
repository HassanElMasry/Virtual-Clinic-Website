import React from "react";
import { Link } from "react-router-dom";

import { Box, VStack, Text, Divider, Icon } from "@chakra-ui/react";

function AdminSidebar() {
  return (
    <Box w="250px" bg="blue.500" color="white" px={4} py={5}>
      <VStack align="stretch" spacing={5}>
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          Menu
        </Text>
        <Divider borderColor="whiteAlpha.400" />
        <VStack align="stretch" spacing={3}>
          <Link to="/admin/add-admin" display="flex" alignItems="center">
            Add Admin
          </Link>
          <Link display="flex" alignItems="center" to="/admin/request-list">
            Doctor Requests
          </Link>
          <Link display="flex" alignItems="center" to="/admin/admin-list">
            Admins
          </Link>
          <Link display="flex" alignItems="center" to="/admin/patient-list">
            Patients
          </Link>
          <Link display="flex" alignItems="center" to="/admin/doctor-list">
            Doctors
          </Link>
          <Link display="flex" alignItems="center" to="/admin/packages">
            Packages
          </Link>
          <Link display="flex" alignItems="center" to="/change-password">
            Change Password
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
}

export default AdminSidebar;
