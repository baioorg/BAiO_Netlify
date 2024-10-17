"use client";

import React from "react";
import {useState, useEffect} from "react";

import { IoClose } from "react-icons/io5"
import { FaUserCircle } from 'react-icons/fa';
import styles from "./ProfileSettingsMenu.module.css";



export default function ProfileSettingsMenu({type = 'profileSettings', closeProfileSettings}) {

    const [userInfo, setUserInfo] = useState({
        first_name: '',
        last_name: '',
        email: '',
        country: '',
        affiliation: '',
        position: '',
        field_of_study: '',
        data_joined: ''
    });

    // Fetch user info on component mount
    useEffect(() => {
        async function getUserInfo() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    alert("You are not logged in, please log in");
                    return;
                }

                const response = await fetch("http://127.0.0.1:8000/user/info/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);  // Set the fetched data to state
                } else {
                    alert("Failed to retrieve user information");
                }
            } catch (error) {
                alert("An error occurred while retrieving user information");
            }
        }

        getUserInfo();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    return (
        <div className={styles.profileSettings}>
            <div className={styles.menuHeader}>
                <h1>Profile</h1>
                <button onClick={closeProfileSettings}><IoClose size={"1.7em"} /></button>
            </div>
            <hr />

            <div className={styles.profileMenu}>
                <div className={styles.buttonSection}>
                    <FaUserCircle className={styles.profileImage} />
                    <button className={styles.editButton}>Upload Image</button>
                    <button className={styles.editButton}>Edit Profile</button>
                    <button className={styles.editButton}>Change Password</button>
                    <button id={styles.deleteButton}>Delete Profile</button>
                </div>
                <div className={styles.informationSection}>
                    <div className={styles.infoitem}>
                        <strong>First Name:</strong> <span>{userInfo.first_name}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Last Name:</strong> <span>{userInfo.last_name}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Email:</strong> <span>{userInfo.email}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Country:</strong> <span>{userInfo.country}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Affiliation:</strong> <span>{userInfo.affiliation}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Position:</strong> <span>{userInfo.position}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Field of Study:</strong> <span>{userInfo.field_of_study}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Registration Date:</strong> <span>{userInfo.data_joined}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}