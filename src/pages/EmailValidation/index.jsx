"use client"

import Header from "../../components/Header/Header";
import styles from "./ValidationPage.module.css"
import Image from "next/image";
import Link from "next/link";



export default function EmailValidation() {
   
    return(
        <div>
            <Header/>
            <div className = {styles.bracket}> 
                <div className = {styles.valpage}>                   
                    <div className= {styles.valcontent}>
                        <Image className={styles.letterImg} src="/mail.svg" alt="Letter" height={100} width={100}/>
                        <h1> Verify your email address to complete create new BAiO user.</h1>

                        <h2>We have sent a verification link to the email you registered with.</h2>

                        <h2>Click on the link in the mail to complete the registration process.</h2>
                       
                        <h2>If you do not receive the email in a timely manner, 
                            please check your spam folder or resend verification email below.</h2>

                            <div className={styles.valbtncontainer}>
                            <button className={styles.valbtn} type="submit">Resend verification email</button>
                            <Link className ={styles.valbtncontainer} href="/">
                                <button className={styles.valbtn}>Sign in to BAiO</button>
                            </Link>
                            </div>
                    </div>
                </div>    
            </div>
        </div>
    );
}