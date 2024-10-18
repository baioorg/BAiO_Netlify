"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from 'react-icons/fa';
import styles from "./ProfileSettingsMenu.module.css";

export default function ProfileSettingsMenu({type = 'profileSettings', closeProfileSettings}) {
    const [profileInfo, setProfileInfo] = useState({
        first_name: '',
        last_name: '',
        email: '',
        country: '',
        affiliation: '',
        position: '',
        field_of_study: '',
        date_joined: ''
    });

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem("access_token"); 
            if (!token) {
                alert("No access token found. Please log in again.");
                return;
            }
    
            try {
                const response = await fetch("http://127.0.0.1:8000/user/info/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, 
                        "Content-Type": "application/json"
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setProfileInfo(data);  
                } else {
                    alert("Failed to fetch profile information.");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                alert("An error occurred while fetching profile information.");
            }
        }
    
        fetchProfile();
    }, []);
    
    

    return (
        <div className={styles.profileSettings}>
            <div className={styles.menuHeader}>
                <h1>Profile</h1>
                <button onClick={closeProfileSettings}><IoClose size={"1.7em"}/></button>  
            </div>
            <hr></hr>

            <div className={styles.profileMenu}>
                <div className={styles.buttonSection}>
                    <FaUserCircle size={"8em"}/>
                    <button className={styles.editButton}>Upload Image</button>
                    <button className={styles.editButton}>Edit Profile</button>
                    <button className={styles.editButton}>Change Password</button>
                    <button id={styles.deleteButton}>Delete Profile</button>
                </div>
                <div className={styles.informationSection}>
                    <div className={styles.infoitem}>
                        <strong>First Name:</strong> <span>{profileInfo.first_name}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Last Name:</strong> <span>{profileInfo.last_name}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Email:</strong> <span>{profileInfo.email}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Country:</strong> <span>{profileInfo.country}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Affiliation:</strong> <span>{profileInfo.affiliation}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Position:</strong> <span>{profileInfo.position}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Field of Study:</strong> <span>{profileInfo.field_of_study}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Registration Date:</strong> <span>{new Date(profileInfo.date_joined).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
