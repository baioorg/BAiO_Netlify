"use client"

import Header from "../../components/Header/Header";

import styles from "./RegistrationPage.module.css"
import RegistrationForm from "./RegistrationForm";

export default function Registration() {
    return(
        <div>
            <Header/>
            <div className = {styles.regbracket}> 
                <div className = {styles.regpage}>                   
                    <div className={styles.regcontent}>
                        <h1> Create new BAiO user account </h1>
                        <RegistrationForm/>
                    </div>
                </div>    
            </div>
        </div>
    );
}