"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from 'react-icons/fa';
import styles from "./ProfileSettingsMenu.module.css";
import config from '../../config/config.json';

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
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({});

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem("access_token"); 
            if (!token) {
                alert("No access token found. Please log in again.");
                return;
            }
    
            try {
                const response = await fetch(`${config.api_url}/user/getInfo/`, {
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
    
    const handleEdit = () => {
        setIsEditing(true);
        setEditedInfo(profileInfo);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("No access token found. Please log in again.");
            return;
        }

        try {
            const response = await fetch(`${config.api_url}/user/updateInfo/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: editedInfo.first_name,
                    last_name: editedInfo.last_name,
                    country: editedInfo.country,
                    affiliation: editedInfo.affiliation,
                    position: editedInfo.position,
                    field_of_study: editedInfo.field_of_study
                })
            });

            if (response.ok) {
                setProfileInfo(editedInfo);
                setIsEditing(false);
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile information.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating profile information.");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedInfo(profileInfo);
    };

    return (
        <div className={styles.profileSettings}>
            <div className={styles.menuHeader}>
                <h1>Profile</h1>
                <button onClick={closeProfileSettings}><IoClose size={"1.7em"}/></button>  
            </div>
            <hr></hr>

            <div className={styles.profileMenu}>
                <div className={styles.buttonSection}>
                    <FaUserCircle className={styles.profileImage}/>
                    <button className={styles.editButton}>Upload Image</button>
                    {!isEditing ? (
                        <button className={styles.editButton} onClick={handleEdit}>Edit Profile</button>
                    ) : (
                        <>
                            <button className={styles.editButton} onClick={handleSave}>Save Changes</button>
                            <button className={styles.editButton} onClick={handleCancel}>Cancel</button>
                        </>
                    )}
                    <button className={styles.editButton}>Change Password</button>
                    <button id={styles.deleteButton}>Delete Profile</button>
                </div>
                <div className={styles.informationSection}>
                    <div className={styles.infoitem}>
                        <strong>First Name:</strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="first_name"
                                value={editedInfo.first_name || ''}
                                onChange={handleInputChange}
                                className={styles.editInput}
                            />
                        ) : (
                            <span>{profileInfo.first_name}</span>
                        )}
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Last Name:</strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="last_name"
                                value={editedInfo.last_name || ''}
                                onChange={handleInputChange}
                                className={styles.editInput}
                            />
                        ) : (
                            <span>{profileInfo.last_name}</span>
                        )}
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Email:</strong> <span>{profileInfo.email}</span>
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Country:</strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="country"
                                value={editedInfo.country || ''}
                                onChange={handleInputChange}
                                className={styles.editInput}
                            />
                        ) : (
                            <span>{profileInfo.country}</span>
                        )}
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Affiliation:</strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="affiliation"
                                value={editedInfo.affiliation || ''}
                                onChange={handleInputChange}
                                className={styles.editInput}
                            />
                        ) : (
                            <span>{profileInfo.affiliation}</span>
                        )}
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Position:</strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="position"
                                value={editedInfo.position || ''}
                                onChange={handleInputChange}
                                className={styles.editInput}
                            />
                        ) : (
                            <span>{profileInfo.position}</span>
                        )}
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Field of Study:</strong>
                        {isEditing ? (
                            <input
                                type="text"
                                name="field_of_study"
                                value={editedInfo.field_of_study || ''}
                                onChange={handleInputChange}
                                className={styles.editInput}
                            />
                        ) : (
                            <span>{profileInfo.field_of_study}</span>
                        )}
                    </div>
                    <div className={styles.infoitem}>
                        <strong>Registration Date:</strong> 
                        <span>{new Date(profileInfo.date_joined).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
