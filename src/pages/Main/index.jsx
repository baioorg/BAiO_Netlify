"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./Main.module.css";
import Header from "../../components/Header/Header";
import SettingsMenu from "../../components/SettingsMenu/SettingsMenu";
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
  const [apiKeys, setApiKeys] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch the access token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      setAccessToken(token);
    }
  }, []);

  // Load API keys from localStorage or fetch from server if not found
  useEffect(() => {
    const storedApiKeys = JSON.parse(localStorage.getItem("api_keys"));
    if (
      storedApiKeys &&
      Array.isArray(storedApiKeys) &&
      storedApiKeys.length > 0
    ) {
      setApiKeys(storedApiKeys);
      setApiKey(storedApiKeys[0].nickname);
      setModel(storedApiKeys[0].provider.models[0]?.name || "");
    } else {
      fetchApiKeys(); // Fetch API keys from the server if not in local storage
    }
  }, [accessToken]);

  const fetchApiKeys = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch("http://158.39.74.70/chat/getApiKeys/", {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const apiKeys = await response.json();
        setApiKeys(apiKeys);
        localStorage.setItem("api_keys", JSON.stringify(apiKeys)); // Store in localStorage

        if (apiKeys.length > 0) {
          setApiKey(apiKeys[0].nickname);
          setModel(apiKeys[0].provider.models[0]?.name || "");
        }
      } else {
        console.error("Failed to fetch API keys from server");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      alert("Please log in again.");
      return null;
    }
    try {
      const response = await fetch("http://158.39.74.70/user/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        setAccessToken(data.access);
        return data.access;
      } else {
        console.error("Failed to refresh token");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      return null;
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    let token = accessToken;
    if (!token) {
      token = await refreshAccessToken();
      if (!token) return null;
    }
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    let response = await fetch(url, options);
    if (response.status === 401) {
      token = await refreshAccessToken();
      if (!token) return null;
      options.headers.Authorization = `Bearer ${token}`;
      response = await fetch(url, options);
    }
    return response;
  };

  const fetchConversations = useCallback(async () => {
    const response = await fetchWithAuth(
      "http://158.39.74.70/chat/getConversations/",
      {
        method: "GET",
      }
    );
    if (response && response.ok) {
      const data = await response.json();
      setPreviousChats(data);
      return data;
    } else {
      console.error("Error fetching conversations");
      return [];
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchConversations().then((data) => {
        if (data && data.length > 0) {
          // Conversations are fetched and available but not auto-selected.
          setPreviousChats(data); // Set only the list of conversations
        }
      });
    }
  }, [accessToken, fetchConversations]);

  const fetchConversation = async (conversationId) => {
    const response = await fetchWithAuth(
      `http://158.39.74.70/chat/getConversation/?conversation_id=${conversationId}`,
      { method: "GET" }
    );
    if (response && response.ok) {
      const data = await response.json();
      setMessages(data.messages);
      setSelectedConversationId(conversationId);
    } else {
      console.error("Error fetching conversation");
    }
  };

  const handleNewChat = async () => {
    const response = await fetchWithAuth(
      "http://158.39.74.70/chat/createConversation/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Research Topic" }),
      }
    );
    if (response && response.ok) {
      const data = await response.json();
      setPreviousChats([...previousChats, data]);
      setSelectedConversationId(data.id);
      setMessages(data.messages || []);
      return data.id;
    } else {
      console.error("Error creating conversation");
      return null;
    }
  };
  const handleMessageSend = async (conversationId = selectedConversationId) => {
    if (!newMessage.trim()) return;
    if (!apiKey) {
      alert("You don’t have any API key selected");
      return;
    }
    if (!conversationId) {
      conversationId = await handleNewChat();
      if (!conversationId) {
        console.error("Failed to create a new conversation");
        return;
      }
    }

    const response = await fetchWithAuth(
      "http://158.39.74.70/chat/sendMessage/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          apikey_nickname: apiKey,
          content: newMessage,
          model: model,
        }),
      }
    );

    if (response && response.ok) {
      const reader = response.body.getReader();
      let decoder = new TextDecoder();
      let streamedMessage = "";

      // Update messages state to include the new user message
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: newMessage, role: "user" },
        { content: "", role: "bot" },
      ]);
      setNewMessage("");

      // Read the response stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamedMessage += decoder.decode(value, { stream: true });

        // Update the latest bot message with streamed content
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].content = streamedMessage;
          return updatedMessages;
        });
      }
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: "You need to activate a valid API key to send messages",
          role: "bot",
        },
      ]);
      setNewMessage("");
    }
  };


  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const handleApiKeyChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "add-new-key") {
      openSettings();
    } else {
      setApiKey(selectedValue);
      const selectedKey = apiKeys.find((key) => key.nickname === selectedValue);
      if (selectedKey) {
        setModel(selectedKey.provider.models[0]?.name || "");
      }
    }
  };

  return (
    <div className={styles.mainpage}>
      <div className={styles.maincontent}>
        <Header />
        {isSettingsOpen && <SettingsMenu closeSettings={closeSettings} />}
        <div className={`${styles.leftmenu} ${isMenuOpen ? styles.open : ""}`}>
          <button onClick={handleNewChat} className={styles.menubutton}>
            New Chat
          </button>

          <select
            value={apiKey}
            onChange={handleApiKeyChange}
            className={styles.menubutton}
          >
            {/* Only show "Select API Key" if there are no API keys */}
            {apiKeys.length === 0 && <option value="">Select API Key</option>}
            {apiKeys.map((key, index) => (
              <option key={index} value={key.nickname}>
                {key.nickname} ({key.provider.name})
              </option>
            ))}
            <option value="add-new-key" style={{ fontWeight: "bold" }}>
              + Add API Key
            </option>
          </select>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={styles.menubutton}
          >
            <option value="">Select Model</option>
            {apiKeys
              .find((key) => key.nickname === apiKey)
              ?.provider.models.map((model, index) => (
                <option key={index} value={model.name}>
                  {model.name}
                </option>
              ))}
          </select>

          <div className={styles.previouschats}>
            <ul>
              {Array.isArray(previousChats) && previousChats.length > 0 ? (
                previousChats.map((chat, index) => (
                  <li key={index}>
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
                          size={24}
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

        <div
          className={`${styles.chatwindow} ${isMenuOpen ? styles.hidden : ""}`}
        >
          <div className={styles.chatheader}>
            <IoMdMenu onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
          <div className={styles.chatmessages}>
            {messages.map((message, index) => (
              <div key={index} className={styles.messagecontainer}>
                <p
                  className={`${styles.message} ${
                    message.role === "user"
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
