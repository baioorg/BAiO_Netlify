import { useState } from "react";
import styles from "./LoginPage.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import config from '../../config/config.json';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LogInForm() {
  const [username, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
        const response = await fetch(`${config.api_url}/user/auth/`, {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();

            // Log the data to check if tokens are received
            console.log("Login response:", data);

            // Storing access and refresh tokens
            localStorage.setItem("access_token", data.access); 
            localStorage.setItem("refresh_token", data.refresh);

            // Fetch and store API keys
            await fetchApiKeys(data.access);

            router.push("/Main");
        } else {
            alert(`Login failed: ${data.detail}`);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login");
    }
}

  async function fetchApiKeys(accessToken) {
    try {
      const apiKeyResponse = await fetch(`${config.api_url}/chat/getApiKeys/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (apiKeyResponse.ok) {
        const apiKeys = await apiKeyResponse.json();
        console.log("API Keys:", apiKeys);
        localStorage.setItem("api_keys", JSON.stringify(apiKeys));
      } else {
        console.error("Failed to retrieve API keys");
      }
    } catch (error) {
      console.error("API key fetch error:", error);
    }
  }


  function fieldsFilled(event) {
    if (username.length >= 5 && password.length >= 5) {
      return handleSubmit(event);
    } else {
      alert("User login failed. Both username and password must be at least 5 characters long.");
      return false;
    }
  }

  return (
    <div className={styles.logincontainer}>
      <form onSubmit={fieldsFilled} className={styles.newitemform}>
        <div className={styles.formrow}>
          <label htmlFor="user">User</label>
          <input
            value={username}
            onChange={(user) => setNewUsername(user.target.value)}
            type="text"
            id="user"
          />
        </div>
        <div className={styles.formrow}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordContainer}>
            <input
              value={password}
              onChange={(password) => setPassword(password.target.value)}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="off"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button className={styles.btn} type="submit">
          Sign In
        </button>
        <Link className={styles.textLink} href="/">
          Forgot password?
        </Link>
      </form>
    </div>
  );
}