"use client";
import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from 'react-markdown';
import styles from "./Main.module.css";
import Header from "../../components/Header/Header";
import SettingsMenu from "../../components/SettingsMenu/SettingsMenu";
import { IoIosSend, IoMdMenu } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { FiCheck } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import config from '../../config/config.json';
import { useRouter } from 'next/router';

// Component to handle function calls display
const FunctionCallBox = ({ content, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.functionCallBox}>
      <div 
        className={styles.functionCallHeader} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Function Call</span>
        {isLoading ? (
          <AiOutlineLoading3Quarters className={styles.loadingIcon} />
        ) : (
          isExpanded ? <FaChevronUp /> : <FaChevronDown />
        )}
      </div>
      {isExpanded && (
        <pre className={styles.functionCallContent}>
          {content}
        </pre>
      )}
    </div>
  );
};

// Helper function to parse message content
const parseMessageContent = (content) => {
  // Check if the content contains function calls
  const functionCallMatch = content.match(/called_functions:\[(.*?)\]function_responses:\[(.*?)\](.*)/s);
  
  if (functionCallMatch) {
    return {
      functionCalls: {
        calls: functionCallMatch[1],
        responses: functionCallMatch[2]
      },
      message: functionCallMatch[3]
    };
  }
  
  return {
    message: content
  };
};

export default function Main() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [apiKeyID, setApiKeyID] = useState("");
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
    const validateAndSetToken = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        
        if (!token) {
          router.push('/');
          return;
        }

        try {
          const response = await fetch(`${config.api_url}/user/validateToken/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
          });

          const data = await response.json();

          if (!response.ok || !data.valid) {
            localStorage.removeItem("access_token");
            router.push('/');
            return;
          }

          setAccessToken(token);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem("access_token");
          router.push('/');
        }
      }
    };

    validateAndSetToken();
  }, [router]);

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
      setApiKeyID(storedApiKeys[0].id)
      setModel(storedApiKeys[0].provider.models[0]?.name || "");
    } else {
      fetchApiKeys(); // Fetch API keys from the server if not in local storage
    }
  }, [accessToken]);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch(`${config.api_url}/chat/getApiKeys/`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("access_token")}` 
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
        localStorage.setItem("api_keys", JSON.stringify(data));
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
      const response = await fetch(`${config.api_url}/user/refresh/`, {
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
      `${config.api_url}/chat/getConversations/`,
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
      `${config.api_url}/chat/getConversation/?conversation_id=${conversationId}`,
      { method: "GET" }
    );
    if (response && response.ok) {
      const data = await response.json();
      setMessages(data.messages);
      setSelectedConversationId(conversationId);
      setIsMenuOpen(false); // Close menu after selecting a conversation
    } else {
      console.error("Error fetching conversation");
    }
  };

  const handleNewChat = async () => {
    const response = await fetchWithAuth(
      `${config.api_url}/chat/createConversation/`,
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
      setIsMenuOpen(false); // Close menu after creating new chat
      return data.id;
    } else {
      console.error("Error creating conversation");
      return null;
    }
  };

  const handleMessageSend = async (conversationId = selectedConversationId) => {
    if (!newMessage.trim()) return;
    if (!apiKey) {
      alert("You don't have any API key selected");
      return;
    }

    const userMessage = newMessage;
    setNewMessage(""); // Clear input early for better UX

    // Ensure we have a valid conversation ID first
    if (!conversationId) {
      conversationId = await handleNewChat();
      if (!conversationId) {
        console.error("Failed to create a new conversation");
        return;
      }
    }

    // Now add the user message after we have a valid conversation
    setMessages(prevMessages => [...prevMessages, { content: userMessage, role: "user" }]);

    // Add empty bot message to show loading state
    setMessages(prevMessages => [...prevMessages, { content: "", role: "bot" }]);

    const response = await fetchWithAuth(
      `${config.api_url}/chat/sendMessage/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          apikey_id: apiKeyID,
          content: userMessage,
          model: model,
        }),
      }
    );

    if (response && response.ok) {
      const reader = response.body.getReader();
      let decoder = new TextDecoder();
      let streamedMessage = "";

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
      // Replace empty bot message with error message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          content: "You need to activate a valid API key to send messages",
          role: "bot",
        };
        return updatedMessages;
      });
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

  const handleTitleEdit = (chatId, currentTitle) => {
    setIsEditing(chatId);
    setEditedTitle(currentTitle);
  };

  const handleSaveTitle = async (chatId) => {
    if (!editedTitle.trim()) return;

    const response = await fetchWithAuth(
      `${config.api_url}/chat/renameConversation/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: chatId,
          title: editedTitle,
        }),
      }
    );

    if (response && response.ok) {
      // Update the title in the local state
      setPreviousChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, title: editedTitle } : chat
        )
      );
      setIsEditing(null); // Exit edit mode
    } else {
      console.error("Failed to update conversation title");
    }
  };

  const handleDeleteConversation = async (chatId, e) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const response = await fetch(`${config.api_url}/chat/deleteConversation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({ conversation_id: chatId }),
      });

      if (response.ok) {
        // Remove the deleted conversation from the state
        setPreviousChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
        
        // If the deleted conversation was selected, clear the messages and selection
        if (selectedConversationId === chatId) {
          setSelectedConversationId(null);
          setMessages([]);
        }
      } else {
        console.error("Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <div className={styles.mainpage}>
      <div className={styles.maincontent}>
        <Header />
        {isSettingsOpen && (
          <SettingsMenu 
            closeSettings={closeSettings} 
            onApiKeyAdded={fetchApiKeys}
          />
        )}
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
                  <li 
                    key={index} 
                    onClick={() => {
                      if (isEditing !== chat.id) {
                        fetchConversation(chat.id);
                      }
                    }}
                    className={styles.chatItem}
                  >
                    {isEditing === chat.id ? (
                      <>
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveTitle(chat.id);
                            }
                          }}
                          autoFocus
                        />
                        <FiCheck
                          size={24}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveTitle(chat.id);
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <span className={styles.chatTitle}>{chat.title}</span>
                        <div className={styles.chatIcons}>
                          <CiEdit
                            size={24}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTitleEdit(chat.id, chat.title);
                            }}
                          />
                          <MdDelete
                            size={24}
                            onClick={(e) => handleDeleteConversation(chat.id, e)}
                            className={styles.deleteIcon}
                          />
                        </div>
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
          <div className={`${styles.chatmessages} ${messages.length === 0 ? styles.emptyChat : ''}`}>
            {messages.length === 0 ? (
              <div className={styles.noMessages}>
                <h2>Hello! How can I assist with genetic or bio data?</h2>
              </div>
            ) : (
              messages.map((message, index) => {
                const parsedContent = parseMessageContent(message.content);
                const isLastMessage = index === messages.length - 1;
                const isEmptyLastMessage = isLastMessage && !message.content;

                return (
                  <div key={index} className={styles.messagecontainer}>
                    <div
                      className={`${styles.message} ${
                        message.role === "user"
                          ? styles.usermessage
                          : styles.botmessage
                      }`}
                    >
                      {parsedContent.functionCalls && (
                        <FunctionCallBox 
                          content={`Calls: ${parsedContent.functionCalls.calls}\nResponses: ${parsedContent.functionCalls.responses}`}
                          isLoading={isEmptyLastMessage}
                        />
                      )}
                      {parsedContent.message && (
                        <ReactMarkdown>{parsedContent.message}</ReactMarkdown>
                      )}
                      {isEmptyLastMessage && (
                        <AiOutlineLoading3Quarters className={styles.messageLoading} />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className={`${styles.chatinput} ${messages.length === 0 ? styles.emptyChatInput : ''}`}>
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
