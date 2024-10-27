"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./Main.module.css";
import Header from "../../components/Header/Header";
import { IoIosSend, IoMdMenu } from "react-icons/io";
import { CiEdit } from "react-icons/ci";

export default function Main() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [previousChats, setPreviousChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // New states for editing
  const [isEditing, setIsEditing] = useState(null); // Track which chat is being edited
  const [editedTitle, setEditedTitle] = useState(""); // Track the new title value

  // Fetch the access token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      setAccessToken(token);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    alert("fetching conversations");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/chat/getConversations/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        alert("setPreviousChats " + previousChats.length);
        setPreviousChats(data); // Set the data correctly if it's an array
        
        
      } else {
        console.error("Unexpected data format, expected an array.");
        setPreviousChats([]); // Set to an empty array if the response is not an array
      }
    } catch (error) {
      console.error("Error fetching conversations", error);
      setPreviousChats([]); // Set to an empty array on error
    }
  }, [accessToken]); // Memoize based on accessToken

  const fetchConversation = async (conversationId) => {
    alert("fetching conversation")
    try {
      const response = await fetch(`http://127.0.0.1:8000/chat/getConversation/?conversation_id=${conversationId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setMessages(data.messages);
      setSelectedConversationId(conversationId);
    } catch (error) {
      console.error("Error fetching conversation", error);
    }
  };

  
  const handleNewChat = async () => {
    try {
      alert("creating new conversation")
      const response = await fetch("http://127.0.0.1:8000/chat/createConversation/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "New Research Topic" }),
      });
      const data = await response.json();
      setMessages([]);
      setPreviousChats([...previousChats, data]); // Add the new chat to previousChats
      alert(previousChats)
    } catch (error) {
      console.error("Error creating conversation", error);
    }
  };

// Fetch all conversations once accessToken is set
  useEffect(() => {
    if (accessToken) {
      fetchConversations();
    }
  }, [accessToken, fetchConversations])

  const handleMessageSend = async () => {
    if (!newMessage.trim()) return;

    alert("conversation id " + selectedConversationId)

    try {
      const response = await fetch("http://127.0.0.1:8000/chat/sendMessage/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: selectedConversationId,
          apikey_nickname: apiKey,
          content: newMessage,
          model: model,
        }),
      });

      const reader = response.body.getReader();
      let decoder = new TextDecoder();
      let result = await reader.read();
      let streamedMessage = decoder.decode(result.value);

      setMessages([...messages, { text: newMessage, sender: "user" }]); // Add user message
      setMessages([...messages, { text: streamedMessage, sender: "bot" }]); // Add bot message
      setNewMessage(""); // Clear input
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  // Handle editing the conversation title
  const handleTitleEdit = (chatId, currentTitle) => {
    setIsEditing(chatId); // Set the current chat in editing mode
    setEditedTitle(currentTitle); // Set the current title to the state
  };

  // Handle saving the edited title
  const handleSaveTitle = async (chatId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/chat/renameConversation/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: chatId,
          new_title: editedTitle,
        }),
      });

      const data = await response.json();
      console.log(data.detail);

      // Update the title in previousChats
      setPreviousChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, title: editedTitle } : chat
        )
      );

      setIsEditing(null); // Exit editing mode
    } catch (error) {
      console.error("Error renaming conversation", error);
    }
  };

  const handleApiKeyChange = (e) => {
    const selectedKey = e.target.value;
    setApiKey(selectedKey);
    
    // Add any additional logic for handling API key change
  };
  

  return (
    <div className={styles.mainpage}>
      <div className={styles.maincontent}>
        <Header />

        {/* Left Menu */}
        <div className={`${styles.leftmenu} ${isMenuOpen ? styles.open : ""}`}>
          <button onClick={handleNewChat} className={styles.menubutton}>
            New Chat
          </button>

          <select
            value={apiKey}
            onChange={handleApiKeyChange}
            className={styles.menubutton}
          >
            <option value="">Select API Key</option>
            <option value="key1">API Key 1</option>
            <option value="key2">API Key 2</option>
          </select>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={styles.menubutton}
          >
            <option value="">Select Model</option>
            <option value="model1">Model 1</option>
            <option value="model2">Model 2</option>
          </select>

          <div className={styles.previouschats}>
            <ul>
              {Array.isArray(previousChats) && previousChats.length > 0 ? (
                previousChats.map((chat, index) => (
                  <li key={index}>
                    {/* Conditional rendering: if editing, show input; otherwise, show title */}
                    {isEditing === chat.id ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveTitle(chat.id);
                        }}
                      />
                    ) : (
                      <>
                        <span onClick={() => fetchConversation(chat.id)}>
                          {chat.title}
                        </span>
                        <CiEdit
                          size={24} // This makes the icon bigger, you can adjust the size value
                          onClick={() => handleTitleEdit(chat.id, chat.title)}
                        />
                      </>
                    )}
                  </li>
                ))
              ) : (
                <li>No previous chats found</li>
              )}
            </ul>
          </div>
        </div>

        {/* Chat Window */}
        <div className={`${styles.chatwindow} ${isMenuOpen ? styles.hidden : ""}`}>
          <div className={styles.chatheader}>
            <IoMdMenu onClick={() => setIsMenuOpen(!isMenuOpen)} /> {/* Toggle menu */}
          </div>
          <div className={styles.chatmessages}>
            {messages.map((message, index) => (
              <div key={index} className={styles.messagecontainer}>
                <p
                  className={`${styles.message} ${
                    message.sender === "user"
                      ? styles.usermessage
                      : styles.botmessage
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
          </div>

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
