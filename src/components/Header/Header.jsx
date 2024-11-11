"use client";

import React, { useState, useRef } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import { FaGithub, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import ProfileSettingsMenu from "../ProfileSettingsMenu/ProfileSettingsMenu";

export default function Header({ type = "header" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Link href="/" className={styles.navbarLink}>
            <h1>BAiO</h1>
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
          <Link href="/Main" className={styles.navbarLink}>
            New Chat
          </Link>
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
