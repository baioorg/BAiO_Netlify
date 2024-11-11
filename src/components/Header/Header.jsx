"use client";

import React, { useState, useRef } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import { PiDna } from "react-icons/pi";
import { FaGithub, FaUserCircle, FaBars, FaTimes, FaDna } from "react-icons/fa";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import ProfileSettingsMenu from "../ProfileSettingsMenu/ProfileSettingsMenu";
import config from '../../config/config.json';

export default function Header({ type = "header" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch(`${config.api_url}/user/validateToken/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
      } else {
        window.location.href = "/Main";
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }
  };

  function toggleDropdown() {
    setIsDropdownOpen((prevstate) => !prevstate);
    setIsSettingsOpen(false);
    setIsProfileSettingsOpen(false);
  }

  function openSettings() {
    setIsSettingsOpen(true);
    setIsDropdownOpen(false);
    setIsProfileSettingsOpen(false);
  }

  function closeSettings() {
    setIsSettingsOpen(false);
    setIsDropdownOpen(false);
    setIsProfileSettingsOpen(false);
  }

  function openProfileSettings() {
    setIsProfileSettingsOpen(true);
    setIsSettingsOpen(false);
    setIsDropdownOpen(false);
  }

  function closeProfileSettings() {
    setIsProfileSettingsOpen(false);
    setIsSettingsOpen(false);
    setIsDropdownOpen(false);
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false);
    setIsSettingsOpen(false);
    setIsProfileSettingsOpen(false);
  }

  return (
    <div>
      <header className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <Link href="/" className={styles.navbarLink} onClick={handleLogoClick}>
            <h1><PiDna size="0.8em" /> Baio</h1>
          </Link>
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes color="#ffffff" size="1.5em" />
            ) : (
              <FaBars color="#ffffff" size="1.5em" />
            )}
          </button>
        </div>

        <div className={`${styles.navbarRight} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link
            href="https://github.com/baioorg/"
            target="_blank"
            className={styles.navbarLink}
          >
            <FaGithub color="#ffffff" size="1.5em" />
            Github
          </Link>
          <Link href="/About" className={styles.navbarLink}>
            About
          </Link>
          <Link href="/Team" className={styles.navbarLink}>
            Contact
          </Link>
          <button
            onClick={toggleDropdown}
            className={styles.profileButton}
            aria-label="Profile Menu"
          >
            <FaUserCircle color="#ffffff" size="3em" />
          </button>
        </div>
      </header>
      {isDropdownOpen && (
        <ProfileDropdown
          openSettings={openSettings}
          openProfileSettings={openProfileSettings}
        />
      )}
      {isSettingsOpen && <SettingsMenu closeSettings={closeSettings} />}
      {isProfileSettingsOpen && (
        <ProfileSettingsMenu closeProfileSettings={closeProfileSettings} />
      )}
    </div>
  );
}
