"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import styles from "./SettingsMenu.module.css";

export default function SettingsMenu({type = 'settings', closeSettings}) {
    return (
        <div className={styles.menu}>
            <div className={styles.menuHeader}>
                <h1>Settings</h1>
                <button onClick={closeSettings}><IoClose size={"1.7em"}/></button>
                
            </div>
            <hr></hr>
            <form>
                <label for="name">Name</label>
                <input name="name" id="nameInput" placeholder="My api key" type="text"/>
                <label for="apiProvider">LLM API Provider</label>
                <select name="apiProvider" id="apiProviderInput">
                    <option value="">Select Provider</option>
                </select>
                <label for="apiKey">API Key</label>
                <input name="apiKey" id="apiKeyInput" placeholder="12345" type="password"/>
                <button type="submit" id="submitButton">Save</button>
            </form>
        </div>
    );

}