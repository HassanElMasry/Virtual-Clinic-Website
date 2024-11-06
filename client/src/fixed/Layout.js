import { Box, Text, Flex, VStack, Spacer, Grid } from "@chakra-ui/react";

const Footer = () => {
  // Your Footer component's content
  return (
    <Flex
      as="footer"
      p={4}
      justifyContent="space-between"
      alignItems="center"
      bg="blue.600"
      color="white"
      width="full"
    >
      {/* Text on the Left */}
      <Box>
        <Text>&copy; 2023 El7a2ny</Text>
      </Box>

      {/* Text on the Right */}
      <Box>
        <ul>
          <li>
            <a href="/privacy">Privacy Policy</a>
          </li>
          <li>
            <a href="/terms">Terms of Service</a>
          </li>
        </ul>
      </Box>
    </Flex>
  );
};

const Layout = ({ header, sidebar, children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      {/* Header */}
      {header}

      {/* Content Area (Sidebar + Main Content) */}
      <Flex flex="1" overflowY="hidden">
        {/* Sidebar */}
        {sidebar}

        {/* Main Content */}
        <Box flex="1" overflowY="auto">
          {children}
        </Box>
      </Flex>

      <Footer />
    </Flex>
  );
};
export default Layout;
