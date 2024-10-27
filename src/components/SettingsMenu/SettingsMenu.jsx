"use client";

import React from "react";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./SettingsMenu.module.css";
import { useRouter } from "next/navigation";

export default function SettingsMenu({ type = "settings", closeSettings }) {
  const [name, setName] = useState("");
  const [apiProvider, setApiProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [accessToken, setAccessToken] = useState(null);

  const router = useRouter();

  // Fetch the access token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      setAccessToken(token);
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    alert("handleSubmit");
    try {
      alert("inside try");
      const response = await fetch("http://127.0.0.1:8000/chat/addAPIKey/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, apiProvider, apiKey }),
      });

      alert(
        "name: " + name + " apiProvider: " + apiProvider + " apiKey: " + apiKey
      );

      if (response.ok) {
        alert("response ok");
        const data = await response.json();

        alert(`API key named ${data.name} successfully registered`);
        router.push("/Main");
      } else {
        alert("response not ok")
        alert(`API key registration failed`);
      }
    } catch (error) {
      console.error("API registration error:", error);
      alert("A error occurred API registration error " + error);
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
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <label for="name">Name</label>
        <input
          name="name"
          id="nameInput"
          placeholder="My api key"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
        <label for="apiProvider">LLM API Provider</label>
        <select
          name="apiProvider"
          id="apiProviderInput"
          onChange={(e) => setApiProvider(e.target.value)}
        >
          <option value="">Select Provider</option>
          <option value="openai">OpenAI</option>
          {/* Add more providers as needed */}
        </select>

        <label for="apiKey">API Key</label>
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
