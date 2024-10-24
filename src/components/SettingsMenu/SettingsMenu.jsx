"use client";

import React from "react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./SettingsMenu.module.css";
import { useRouter } from "next/navigation";

export default function SettingsMenu({ type = "settings", closeSettings }) {
  const [name, setName] = useState("");
  const [apiProvider, setApiProvider] = useState("");
  const [apiKey, setApiKey] = useState("");

  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/chat/addAPIKey/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, apiProvider, apiKey }),
      });

      if (response.ok) {
        const data = await response.json();

        alert(`API key named ${name} successfully registered`);
        router.push("/Main");
      } else {
        alert(`API key registration failed`);
      }
    } catch (error) {
      console.error("API registration error:", error);
      alert("An error occurred API registration error");
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
        <select name="apiProvider" id="apiProviderInput">
          <option value="">Select Provider</option>
          <option value="openai">OpenAI</option>
          {/* Add more providers as needed */}
          onChange={(e) => setApiProvider(e.target.value)}
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
