import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

import {
  Box,
  Checkbox,
  Input,
  Text,
  Spinner,
  Heading,
  List,
  ListItem,
  ListIcon,
  Flex,
  useColorModeValue,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    filterOn: false,
    date: "",
    status: "",
  });

  const [userRole, setUserRole] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e) => setInputValue(e.target.value);

  const [isModalTwoOpen, setModalTwoOpen] = useState(false);
  const handleModalTwoOpen = () => setModalTwoOpen(true);
  const handleModalTwoClose = () => setModalTwoOpen(false);

  const [isPrescriptionMenuOpen, setPrescriptionMenuOpen] = useState(false);
  const handlePrescriptionMenuOpen = () => setPrescriptionMenuOpen(true);
  const handlePrescriptionMenuClose = () => setPrescriptionMenuOpen(false);

  const [isAddPrescriptionOpen, setAddPrescriptionOpen] = useState(false);
  const handleAddPrescriptionOpen = () => setAddPrescriptionOpen(true);
  const handleAddPrescriptionClose = () => setAddPrescriptionOpen(false);

  const [prescription, setPrescription] = useState({
    filled: false,
    dose: "",
    name: "",
  });

  const handlePayPrescriptionWallet = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/appointment/pay-prescription-wallet",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        window.location.reload();
        alert("Prescription paid successfully.");
      }
    } catch (error) {
      console.error("Error paying:", error);
      alert("Paying Error: " + error.message); // Display error message to the user
    }
  };

  const handleAddPrescription = async (id) => {
    console.log(id);
    try {
      const response = await axios.post(
        "http://localhost:8000/appointment/add-prescription",
        {
          appointmentId: id,
          dose: prescription.dose,
          medicine: prescription.name,
          filled: prescription.filled,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        window.location.reload();
        alert("Prescription added successfully.");
      }
    } catch (error) {
      console.error("Error adding:", error);
      alert("Adding Error: " + error.message); // Display error message to the user
    }
  };

  const downloadPrescription = (name, dose, filled) => {
    const doc = new jsPDF();

    doc.text(`Medicine: ${name}`, 10, 10);
    doc.text(`Dose: ${dose}`, 10, 20);
    doc.text(`Filled: ${filled ? "Yes" : "No"}`, 10, 30);

    doc.save("prescription.pdf");
  };

  const handlePrescriptionChange = (e) => {
    setPrescription({
      ...prescription,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrescriptionUpdate = async (old, id) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/appointment/update-prescription",
        {
          dose: prescription.dose,
          oldMedicine: old,
          newMedicine: prescription.name,
          appointmentId: id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        window.location.reload();
        alert("Prescription updated successfully.");
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("Updating Error: " + error.message); // Display error message to the user
    }
  };

  const handleReschedule = async (id) => {
    // Send the inputValue to wherever you need it
    try {
      const response = await axios.post(
        "http://localhost:8000/appointment/reschedule-appointment",
        {
          appointmentId: id,
          date: inputValue,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        window.location.reload();
        alert("Appointment rescheduled successfully.");
      }
    } catch (error) {
      console.error("Error rescheduling:", error);
      alert("Rescheduling Error: " + error.message); // Display error message to the user
    }

    onClose(); // Close the modal after handling the click
  };

  const handleRequestFollowup = async (id) => {
    // Send the inputValue to wherever you need it
    try {
      const response = await axios.post(
        "http://localhost:8000/appointment/request-follow-up",
        {
          appointmentId: id,
          date: inputValue,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        window.location.reload();
        alert("Followup requested successfully.");
      }
    } catch (error) {
      console.error("Error rescheduling:", error);
      alert("Followup Error: " + error.message); // Display error message to the user
    }

    onClose(); // Close the modal after handling the click
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/patient/appointment-list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(filter),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAppointments(data.appointments);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:8000/userRole", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        } else {
          console.error("Failed to fetch role");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
    fetchAppointments();
  }, [filter]);

  const handleCheckoutRedirectPrescription = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/patient/create-checkout-session-appointment"
      );

      // Ensure you're retrieving the sessionId correctly
      const sessionId = response.data.sessionId;

      if (!sessionId) {
        throw new Error("Session ID not found in the response.");
      }

      // Ensure Stripe.js is loaded and your publishable key is correct
      const stripe = window.Stripe(
        "pk_test_51OWPuDBfH26uclDP6c9lfS4HPHG7AaK4W0m3uLnmZfyNeXU0muRv00Tigf8yTdMjcUZQKtfxVIe6ukSvjKUb4Hev00Ig174lsV"
      );

      // Redirect to the checkout session
      const result = await stripe.redirectToCheckout({ sessionId });

      // Check if the redirect failed
      if (result.error) {
        console.error("Stripe Checkout error:", result.error.message);
        alert("Error: " + result.error.message); // Display error message to the user
      }
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
      alert("Checkout Error: " + error.message); // Display error message to the user
    }
  };

  const handleCheckoutRedirect = async (id) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/appointment/approve-appointment",
        {
          appointmentId: id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response = await axios.post(
        "http://localhost:8000/patient/create-checkout-session-appointment"
      );

      // Ensure you're retrieving the sessionId correctly
      const sessionId = response.data.sessionId;

      if (!sessionId) {
        throw new Error("Session ID not found in the response.");
      }

      // Ensure Stripe.js is loaded and your publishable key is correct
      const stripe = window.Stripe(
        "pk_test_51OWPuDBfH26uclDP6c9lfS4HPHG7AaK4W0m3uLnmZfyNeXU0muRv00Tigf8yTdMjcUZQKtfxVIe6ukSvjKUb4Hev00Ig174lsV"
      );

      // Redirect to the checkout session
      const result = await stripe.redirectToCheckout({ sessionId });

      // Check if the redirect failed
      if (result.error) {
        console.error("Stripe Checkout error:", result.error.message);
        alert("Error: " + result.error.message); // Display error message to the user
      }
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
      alert("Checkout Error: " + error.message); // Display error message to the user
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/appointment/cancel-appointment",
        {
          appointmentId: id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(111);
        window.location.reload();
        alert("Appointment cancelled successfully.");
      }
    } catch (error) {
      console.error("Error cancelling:", error);
      alert("Cancelling Error: " + error.message); // Display error message to the user
    }
  };

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setFilter({
        ...filter,
        [name]: checked ? true : null,
      });
      console.log(filter);
    } else {
      setFilter({
        ...filter,
        [name]: value,
      });
    }
  };

  const cardBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box p={4}>
      <Heading mb={6}>Appointment List</Heading>

      <Flex
        direction={["column", "row"]}
        wrap="wrap"
        mb={6}
        alignItems="center"
        gap={4}
      >
        <Checkbox
          isChecked={filter.filterOn}
          onChange={handleFilterChange}
          name="filterOn"
        >
          Filters
        </Checkbox>
        <Flex align="center">
          <Text mr={2}>Date:</Text>
          <Input
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
          />
        </Flex>
        <Flex align="center">
          <Text mr={2}>Status:</Text>
          <Input
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          />
        </Flex>
      </Flex>

      {loading ? (
        <Spinner />
      ) : appointments && appointments.length > 0 ? (
        <List spacing={3}>
          {appointments.map((appointment, index) => (
            <ListItem
              key={index}
              bg={cardBg}
              p={4}
              borderRadius="md"
              shadow="md"
            >
              <Flex alignItems="center" justifyContent="space-between">
                <Text>
                  Patient Name: {appointment.patient.name}, Doctor Name:{" "}
                  {appointment.doctor.name}
                </Text>
              </Flex>
              <Text>
                Date: {appointment.date}, Status: {appointment.status},
              </Text>
              Prescriptions:{" "}
              {appointment.prescriptions.map((prescription, index) => (
                <>
                  <Button onClick={handlePrescriptionMenuOpen}>
                    {/* Render your prescription data here */}
                    Drug: {prescription.name}
                  </Button>
                  <Modal
                    isOpen={isPrescriptionMenuOpen}
                    onClose={handlePrescriptionMenuClose}
                  >
                    <ModalOverlay bg="blackAlpha.300" />
                    <ModalContent>
                      <ModalHeader>Prescription Details:</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        Medicine: {prescription.name}, Dose: {prescription.dose}
                        , Filled: {prescription.filled ? "Yes" : "No"}
                        <Button
                          colorScheme="blue"
                          onClick={() =>
                            downloadPrescription(
                              prescription.name,
                              prescription.dose,
                              prescription.filled
                            )
                          }
                        >
                          Download Prescription
                        </Button>
                        {userRole === "patient" && (
                          <>
                            <Button
                              colorScheme="blue"
                              onClick={handlePayPrescriptionWallet}
                            >
                              Pay with Wallet
                            </Button>
                            <Button
                              colorScheme="blue"
                              onClick={handleCheckoutRedirectPrescription}
                            >
                              Pay with Card
                            </Button>
                          </>
                        )}
                      </ModalBody>

                      <ModalFooter>
                        {userRole === "doctor" && (
                          <>
                            <Input
                              placeholder="New Medicine"
                              name="name"
                              onChange={handlePrescriptionChange}
                            />
                            <Input
                              placeholder="New Dose"
                              name="dose"
                              onChange={handlePrescriptionChange}
                            />
                            <Button
                              colorScheme="blue"
                              onClick={() =>
                                handlePrescriptionUpdate(
                                  prescription.name,
                                  prescription.appointmentId
                                )
                              }
                            >
                              Update
                            </Button>
                          </>
                        )}
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
              ))}
              {userRole === "patient" && appointment.status == "pending" && (
                <Button
                  colorScheme="blue"
                  onClick={() => handleCheckoutRedirect(appointment._id)}
                >
                  Pay with Stripe
                </Button>
              )}
              {userRole === "patient" && appointment.status != "cancelled" && (
                <>
                  <Button colorScheme="blue" onClick={handleModalTwoOpen}>
                    Request Follow Up
                  </Button>
                  <Modal isOpen={isModalTwoOpen} onClose={handleModalTwoClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Follow Up Date</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Input
                          placeholder="Type here..."
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          mr={3}
                          onClick={() => handleRequestFollowup(appointment._id)}
                        >
                          Submit
                        </Button>
                        <Button variant="ghost" onClick={handleModalTwoClose}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
              )}
              {appointment.status != "cancelled" && (
                <>
                  <Button
                    colorScheme="red"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel Appointment
                  </Button>

                  <Button colorScheme="blue" onClick={onOpen}>
                    Reschedule
                  </Button>

                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>New Date</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Input
                          placeholder="Type here..."
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          mr={3}
                          onClick={() => handleReschedule(appointment._id)}
                        >
                          Submit
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  {appointment.status != "cancelled" &&
                    userRole == "doctor" && (
                      <>
                        <Button
                          colorScheme="blue"
                          onClick={setAddPrescriptionOpen}
                        >
                          Add Prescription
                        </Button>
                        <Modal
                          isOpen={isAddPrescriptionOpen}
                          onClose={handleAddPrescriptionClose}
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>New Date</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <Input
                                placeholder="medicine"
                                name="name"
                                onChange={handlePrescriptionChange}
                              />
                              <Input
                                placeholder="dose"
                                name="dose"
                                onChange={handlePrescriptionChange}
                              />
                              <Input
                                placeholder="filled"
                                name="filled"
                                onChange={handlePrescriptionChange}
                              />
                            </ModalBody>

                            <ModalFooter>
                              <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={() =>
                                  handleAddPrescription(appointment._id)
                                }
                              >
                                Submit
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={handleAddPrescriptionClose}
                              >
                                Cancel
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </>
                    )}
                  <Button colorScheme="green">Video Call</Button>
                </>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Text>No appointments found.</Text>
      )}
    </Box>
  );
};

export default AppointmentList;
