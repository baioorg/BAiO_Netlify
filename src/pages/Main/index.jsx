"use client";
import React, { useState } from "react";
import styles from "./Main.module.css"
import Header from "../../components/Header/Header";
import { IoIosSend } from "react-icons/io";

export default function Main() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [previousChats, setPreviousChats] = useState([
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
    "Chat instance title",
  ]);

  const [messages, setMessages] = useState([
    { text: "Hello! What can I help you with?", sender: "bot" },
    { text: "What chromosomes are in the human body?", sender: "user" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleNewChat = () => {
    console.log("New Chat Created");
    setMessages([]);
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handleMessageSend = () => {
    if (newMessage.trim()) {
      // Add the new message to the conversation
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      // Clear the input field
      setNewMessage("");
    }
  };

  return (
    <div className={styles.mainpage}>
      <div className={styles.maincontent}>
        <Header />
        <div className={styles.leftmenu}>
          <button onClick={handleNewChat} className={styles.menubutton}>
            New Chat
          </button>

          <select value={apiKey} onChange={handleApiKeyChange} className={styles.menubutton}>
            <option value="">Select API Key</option>
            <option value="key1">API Key 1</option>
            <option value="key2">API Key 2</option>
          </select>

          <select value={model} onChange={handleModelChange} className={styles.menubutton}>
            <option value="">Select Model</option>
            <option value="model1">Model 1</option>
            <option value="model2">Model 2</option>
          </select>

          <div className={styles.previouschats}>
            <ul>
              {previousChats.map((chat, index) => (
                <li key={index}>{chat}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Window */}
        <div className={styles.chatwindow}>
          <div className={styles.chatmessages}>
            {/* Chat messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={styles.messagecontainer}
              >
                <p className={`${styles.message} ${message.sender === "user" ? styles.usermessage : styles.botmessage}`}>{message.text}</p>

              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className={styles.chatinput}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter") handleMessageSend();
              }}
            />
            <button onClick={handleMessageSend}>
              <IoIosSend size={35} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
