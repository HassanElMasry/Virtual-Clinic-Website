import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Link, withRouter } from "react-router-dom";

import Layout from "./fixed/Layout";

import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";

function Login(props) {
  const { history } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;
        switch (userRole) {
          case "admin":
            history.push("/admin");
            break;
          case "doctor":
            history.push("/doctor");
            break;
          case "patient":
            history.push("/patient");
            break;
          default:
            // Handle unknown roles
            break;
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        // Handle invalid tokens - e.g. redirect to login page, show error message
      }
    }
  }, [history]);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleClick = () => setShow(!show);
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const decodedToken = jwtDecode(data.token);
      const userRole = decodedToken.role;

      switch (userRole) {
        case "admin":
          history.push("/admin");
          break;
        case "doctor":
          history.push("/doctor");
          break;
        case "patient":
          history.push("/patient");
          break;
      }
    } catch (error) {
      setError("Login failed. Please check your username and password.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <Layout>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Heading mt={5} mb={4}>
            Login
          </Heading>

          <InputGroup maxWidth="400px" size="md">
            <Input
              pr="4.5rem"
              type="text"
              placeholder="Enter username"
              onChange={handleUsernameChange}
            />
          </InputGroup>

          <InputGroup maxWidth="400px" size="md" mb="10px">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              onChange={handlePasswordChange}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button colorScheme="blue" onClick={handleLogin}>
            Login
          </Button>
          <Link display="flex" alignItems="center" to="/forgot-password">
            Forgot Password
          </Link>
          <Text width="300px">
            {error && <p style={{ color: "red" }}>{error}</p>}
          </Text>
        </Flex>
      </Layout>
    </div>
  );
}

export default withRouter(Login);
