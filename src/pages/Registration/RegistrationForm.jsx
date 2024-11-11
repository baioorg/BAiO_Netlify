"use client"

import { useState, useMemo } from "react";
import styles from "./RegistrationForm.module.css";
import { useRouter } from "next/navigation";

import Select from "react-select";
import countryList from "react-select-country-list";
import config from '../../config/config.json';  // Add this import

export default function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");  // New state for username
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [position, setPosition] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");

  const router = useRouter();

  //Dropdown menu built: https://www.npmjs.com/package/react-select-country-list
  const countryOptions = useMemo(() => countryList().getData(), []);

  const changeHandler = (country) => {
    setCountry(country);
  };

  // Send user data to the backend and navigate to the Email Validation page
  async function handleSubmit(event) {
    event.preventDefault(); // prevent page reload

    const registrationData = {
      first_name: firstName,
      last_name: lastName,
      username: username,  // Include username in the request
      password: password,
      email: email,
      country: country.label,  // get the label (country name) from the Select component
      affiliation: affiliation,
      position: position,
      field_of_study: fieldOfStudy,
    };

    try {
      const response = await fetch(`${config.api_url}/user/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        // Navigate to the Email Validation page
        router.push("/EmailValidation");
      } else {
        const errorData = await response.json();
        alert("Error during registration: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error during registration");
    }
  }

  function validateEmail() {
    return email.includes("@") && email.includes(".");
  }

  function validatePassword() {
    return password === checkPassword;
  }

  function checkAllFieldsAreNotEmpty() {
    return (
      firstName.length > 1 &&
      lastName.length > 1 &&
      username.length > 1 &&  // Add validation for username
      password.length > 1 &&
      checkPassword.length > 1 &&
      email.length > 1 &&
      country !== "" &&
      affiliation.length > 1 &&
      position.length > 1 &&
      fieldOfStudy.length > 1
    );
  }

  function allFieldsFilled(event) {
    // prevent the default form submission behavior
    event.preventDefault();

    // if all fields are filled
    if (!checkAllFieldsAreNotEmpty()) {
      alert("Please fill all fields.");
      return false;
    }

    // the email looks like an email
    if (!validateEmail()) {
      alert("Please enter a valid email address in the format of email@domain.com.");
      return false;
    }

    if (!validatePassword()) {
      alert("Passwords are not matching. Please try again.");
      return false;
    }

    // send the data
    handleSubmit(event);
  }

  return (
    <form onSubmit={allFieldsFilled} className={styles.newuserform}>
      <div className={styles.regformrow}>
        <label htmlFor="firstName">First Name</label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
          id="firstName"
        />
      </div>
      <div className={styles.regformrow}>
        <label htmlFor="lastName">Last Name</label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          type="text"
          id="lastName"
        />
      </div>
      <div className={styles.regformrow}>
        <label htmlFor="username">Username</label>  {/* New input for username */}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          id="username"
        />
      </div>
      <div className={styles.regformrow}>
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          id="password"
        />
      </div>
      <div className={styles.regformrow}>
        <label htmlFor="checkPassword">Enter password again</label>
        <input
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
          type="text"
          id="checkPassword"
        />
      </div>
      <div className={styles.regformrow}>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          id="email"
        />
      </div>
      <div className={styles.regdropdown}>
        <label htmlFor="country">Country</label>
        <Select
          options={countryOptions}
          value={country}
          onChange={changeHandler}
        />
      </div>
      <div className={styles.regformrow}>
        <label htmlFor="affiliation">Affiliation</label>
        <input
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
          type="text"
          id="affiliation"
        />
      </div>
      <div className={styles.regformrow}>
        <label htmlFor="position">Position</label>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          type="text"
          id="position"
        />
      </div>
      <div className={styles.regformrow}>
        <label htmlFor="fieldOfStudy">Field of study</label>
        <input
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
          type="text"
          id="fieldOfStudy"
        />
      </div>
      <button className={styles.regbtn} type="submit">
        Create new BAiO user account
      </button>
    </form>
  );
}
