import { useState } from "react";
import styles from "./LoginPage.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LogInForm() {
  const [username, setNewUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/user/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);  // Log the response data to inspect the structure
      
        if (data.access && data.refresh) {  // Check if tokens exist in the response
          alert("Login successful");
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          router.push("/Main");
        } else {
          alert("Tokens not found in response");
        }
      } else {
        alert("Login unsuccessful, try again");
      }
    } catch (error) {
      alert("An error occurred during login");
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
          <input
            value={password}
            onChange={(password) => setPassword(password.target.value)}
            type="password"
            id="password"
          />
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
