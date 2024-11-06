import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const ChatRoom = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", { roomId });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message) {
      socket.emit("sendMessage", { roomId, message });
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomId}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
