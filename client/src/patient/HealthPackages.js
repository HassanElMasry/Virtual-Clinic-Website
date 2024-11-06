import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
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
import axios from "axios";

function HealthPackages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [subscribedPackage, setSubscribedPackage] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalContent, setModalContent] = useState("options"); // New state to control modal content

  const handleSubscribe = (pkg) => {
    setSelectedPackage(pkg);
    setModalContent("options");
    onOpen();
  };

  const handleCheckoutRedirect = async () => {
    try {
      const requestBody = { amount: selectedPackage.price };
      const response = await axios.post(
        "http://localhost:8000/patient/create-checkout-session",
        requestBody
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

  const handleSubscribeByWallet = async () => {
    try {
      const requestBody = {
        package: selectedPackage,
      };
      const response = await axios.post(
        "http://localhost:8000/patient/subcribe-package-wallet",
        requestBody, // Pass the requestBody here
        { withCredentials: true }
      );
      console.log(response.data);
      setSubscribedPackage(null);
      fetchSubscriptionInfo();
    } catch (error) {
      console.log("Failed: " + error.response.data);
    }
    closeAndResetModal();
  };

  const handleSubscribeByCard = async () => {
    // const stripe = await stripePromise;
    // Logic for handling Stripe payment
    setModalContent("cardPayment");
  };

  const handlePaymentSuccess = async (paymentMethodId) => {
    // Logic to handle successful payment
    // Call your backend API with the payment method id
    handleSubscribeByCard(paymentMethodId);
    closeAndResetModal();
  };

  const closeAndResetModal = () => {
    setModalContent("options");
    onClose();
  };

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/patient/package-info",
        { withCredentials: true }
      );
      setSubscriptionStatus(response.data.status);
      setSubscribedPackage(response.data.package);
    } catch (error) {
      console.error("Error fetching subscription info:", error);
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/patient/packages"
        );
        setPackages(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching health packages:", error);
        setIsLoading(false);
      }
    };

    fetchPackages();
    fetchSubscriptionInfo();
  }, []);

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/patient/cancel-subscription",
        {},
        { withCredentials: true }
      );
      console.log(response.data);
      setSubscribedPackage(null);
      fetchSubscriptionInfo();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <VStack spacing={4}>
      <Heading>Health Packages</Heading>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={5}>
        {packages.map((pkg, index) => (
          <Box key={index} p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">{pkg.name}</Heading>
            <Text mt={4}>Price: ${pkg.price}</Text>
            <Text>Doctor Discount: {pkg.doctorDiscount}%</Text>
            <Text>Medicine Discount: {pkg.medicineDiscount}%</Text>
            <Text>Family Discount: {pkg.familyDiscount}%</Text>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => handleSubscribe(pkg)}
            >
              Subscribe
            </Button>
          </Box>
        ))}
      </SimpleGrid>
      <Text>
        {subscribedPackage != null && subscribedPackage.name != "null"
          ? `You are subscribed to ${subscribedPackage.name}`
          : "You are not subscribed to any package."}
      </Text>
      <Text>Subscription status: {subscriptionStatus}</Text>
      <Button colorScheme="red" onClick={() => handleCancelSubscription()}>
        Cancel Subscription
      </Button>
      <Modal isOpen={isOpen} onClose={closeAndResetModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Subscribe to {selectedPackage?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Would you like to pay by card or wallet?</Text>
            <Button colorScheme="blue" mr={3} onClick={handleSubscribeByWallet}>
              Wallet
            </Button>
            <Button colorScheme="blue" onClick={handleCheckoutRedirect}>
              Pay with Stripe
            </Button>
          </ModalBody>
          {modalContent === "options" && (
            <ModalFooter>{/* Footer content if needed */}</ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default HealthPackages;
