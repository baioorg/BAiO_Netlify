"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./SettingsMenu.module.css";
import { useRouter } from "next/navigation";
import config from '../../config/config.json';

export default function SettingsMenu({ type = "settings", closeSettings, onApiKeyAdded }) {
  const [name, setName] = useState("");
  const [apiProvider, setApiProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [providers, setProviders] = useState([]);
  const [models, setModels] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      const fetchProviders = async () => {
        try {
          const response = await fetch(`${config.api_url}/chat/getLLMProviders/`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await response.json();
          setProviders(data);
        } catch (error) {
          console.error("Error fetching providers:", error);
        }
      };
      fetchProviders();
    }
  }, [accessToken]);

  const handleProviderChange = (e) => {
    const selectedProviderId = e.target.value;
    setApiProvider(selectedProviderId);

    const selectedProvider = providers.find((provider) => provider.id === parseInt(selectedProviderId));
    setModels(selectedProvider ? selectedProvider.models : []);
  };

  const fetchAndStoreApiKeys = async () => {
    try {
      const response = await fetch(`${config.api_url}/chat/getApiKeys/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const apiKeys = await response.json();
        localStorage.setItem("api_keys", JSON.stringify(apiKeys)); // Store all API keys in local storage
      } else {
        console.error("Failed to fetch API keys");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${config.api_url}/chat/addAPIKey/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, apiProvider, apiKey }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`API key named ${data.nickname} successfully registered`);
        await fetchAndStoreApiKeys(); // Fetch all API keys and store them in local storage
        
        if (onApiKeyAdded) {
          onApiKeyAdded();
        }
        
        closeSettings();
      } else {
        alert("API key registration failed");
      }
    } catch (error) {
      console.error("API registration error:", error);
      alert("An error occurred during API key registration");
    }
  }

  return (
    <div className={styles.menu}>
      <div className={styles.menuHeader}>
        <h1>Settings</h1>
        <button onClick={closeSettings}>
          <IoClose size={"1.7em"} />
        </button>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          name="name"
          id="nameInput"
          placeholder="My API key"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="apiProvider">LLM API Provider</label>
        <select
          name="apiProvider"
          id="apiProviderInput"
          value={apiProvider}
          onChange={handleProviderChange}
        >
          <option value="">Select Provider</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>

        <label htmlFor="apiKey">API Key</label>
        <input
          name="apiKey"
          id="apiKeyInput"
          placeholder="12345"
          type="password"
          onChange={(e) => setApiKey(e.target.value)}
        />

        <button type="submit" id="submitButton">
          Save
        </button>
      </form>
    </div>
  );
}
