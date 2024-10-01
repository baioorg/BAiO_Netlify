"use client";

import React from "react";

import { IoClose } from "react-icons/io5"
import { FaUserCircle } from 'react-icons/fa';
import styles from "./ProfileSettingsMenu.module.css";


export default function ProfileSettingsMenu({type = 'profileSettings', closeProfileSettings}) {
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
                        <strong>First Name:</strong> <span>John</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Last Name:</strong> <span>Doe</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Email:</strong> <span>john.doe@example.com</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Country:</strong> <span>USA</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Affiliation:</strong> <span>OpenAI</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Position:</strong> <span>Developer</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Field of Study:</strong> <span>Computer Science</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Registration Date:</strong> <span>2023-01-15</span>
                    </div>
                </div>
            </div>
        </div>
    );

}