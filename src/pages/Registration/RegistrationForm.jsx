"use client"

import { useState, useMemo } from "react";
import styles from "./RegistrationForm.module.css";
import { useRouter } from "next/navigation";

import Select from "react-select";
import countryList from "react-select-country-list";

export default function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

  //send user to email validation page
  async function handleSubmit() {
    try {
      router.push("/EmailValidation");
    } catch (error) {
      alert("Error during registration");
    }
  }

  function validateEmail() {
    if (email.includes("@") && email.includes(".")) {
      return true;
    } else {
      return false;
    }
  }

  function validatePassword() {
    if (password === checkPassword) {
      return true;
    } else {
      return false;
    }
  }

  function checkAllFieldsAreNotEmpty() {
    if (
      firstName.length > 1 &&
      lastName.length > 1 &&
      password.length> 1 &&
      checkPassword.length>1&&
      email.length > 1 &&
      country !== "" &&
      affiliation.length > 1 &&
      position.length > 1 &&
      fieldOfStudy.length > 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  
  function allFieldsFilled() {
    //dont refresh
    event.preventDefault(); 

    //if all fields are filled
    if (!checkAllFieldsAreNotEmpty()) {
      alert("Please fill all fields.");
      return false;
    }

    //the email looks like an email
    if (!validateEmail()) {
      alert(
        "Please enter a valid email address in the format of email@domain.com."
      );
      return false;
    }

    if (!validatePassword()) {
      alert("Passwords are not matching. Please try again.");
      return false;
    }

    //send it
    handleSubmit();
  }

  return (
   
      <form onSubmit={allFieldsFilled} classname={styles.newuserform}>
        <div className={styles.regformrow}>
          <label htmlFor="firstName">First Name</label>
          <input
            value={firstName}
            onChange={(firstName) => setFirstName(firstName.target.value)}
            type="text"
            id="firstName"
          />
        </div>
        <div className={styles.regformrow}>
          <label htmlFor="lastName">Last Name</label>
          <input
            value={lastName}
            onChange={(lastName) => setLastName(lastName.target.value)}
            type="text"
            id="lastName"
          />
        </div>
        <div className={styles.regformrow}>
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(password) => setPassword(password.target.value)}
            type="text"
            id="password"
          />
        </div>
        <div className={styles.regformrow}>
          <label htmlFor="checkPassword">Enter password again</label>
          <input
            value={checkPassword}
            onChange={(checkPassword) => setCheckPassword(checkPassword.target.value)}
            type="text"
            id="checkPassword"
          />
        </div>
        <div className={styles.regformrow}>
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(email) => setEmail(email.target.value)}
            type="text"
            id="email"
          />
        </div>
        <div className = {styles.regdropdown}>
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
            onChange={(affiliation) => setAffiliation(affiliation.target.value)}
            type="text"
            id="affiliation"
          />
        </div>
        <div className={styles.regformrow}>
          <label htmlFor="position">Position</label>
          <input
            value={position}
            onChange={(position) => setPosition(position.target.value)}
            type="text"
            id="position"
          />
        </div>
        <div className={styles.regformrow}>
          <label htmlFor="fieldOfStudy">Field of study</label>
          <input
            value={fieldOfStudy}
            onChange={(fieldOfStudy) =>
              setFieldOfStudy(fieldOfStudy.target.value)
            }
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
