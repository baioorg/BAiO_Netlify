"use client";

import React from "react";
import styles from './ProfileDropdown.module.css';
import { FaUserCircle } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';
import { FiMoon } from 'react-icons/fi';
import  { MdLogout } from "react-icons/md";
import { useRouter } from 'next/navigation';

export default function ProfileDropDown({type = 'dropdown', openSettings, openProfileSettings}) {
    const router = useRouter();

    const handleSignOut = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <div className={styles.dropdown}>
            <div className={styles.dropdownTop}>
                <button className={styles.dropdownButton} onClick={openProfileSettings}><FaUserCircle size="1.3em"/>Profile</button>
                <button className={styles.dropdownButton} onClick={openSettings}><CiSettings size="1.3em"/>Settings</button>
                <button className={styles.dropdownButton}><FiMoon size="1.3em"/>Swith to Dark Mode</button>
            </div>
            <div className={styles.dropdownButton}>
                <hr className={styles.dropdownDivider}/>
                <button 
                    className={styles.dropdownButton} 
                    onClick={handleSignOut}
                ><MdLogout size="1.3em"/>Sign Out</button>
            </div>
        </div>
    )
}