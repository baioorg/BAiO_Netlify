//https://github.com/KWaloen/My-Portolio-Website/blob/main/src/app/ReactProjects/LoginPage/LogInForm.tsx
//enter any username and password of more than 5 figures to log in

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
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("Login successful");
        router.push("/Main");
      } else {
        alert("Login unsuccessful, try again");
      }
      //unknown error but do not reveal error.
    } catch (error) {
      alert("ARGGHHHH");
    }
  }

  function fieldsFilled(event) {
    if (username.length >= 5 && password.length >= 5) {
      return handleSubmit(event);
    } else {
      alert("User login failed");
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
