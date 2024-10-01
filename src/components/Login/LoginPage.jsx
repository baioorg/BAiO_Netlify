//Adapted from https://github.com/KWaloen/My-Portolio-Website/blob/main/src/app/ReactProjects/LoginPage/page.tsxS

"use client";

import styles from "./LoginPage.module.css";
import LogInForm from "./LoginForm";
import Link from "next/link";

export default function loginPage() {
 
  return (
    <div className={styles.bracket}> 
      <div className={styles.loginPage}> 
        <div className={styles.logincontent}>
          <h1>Sign in to BAiO as an existing user</h1>
          <LogInForm />
          <hr className={styles.line} /> 
          <h1>Register as a new BAiO user</h1>
          <Link href="/Registration" className={styles.btn}>
            <button>Create new user account</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
