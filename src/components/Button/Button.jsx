import React from "react";
import './Button.css';

export default function Button({onClick, children, type = 'button'}) {
    return (
        <button className="custom-button" onClick={onClick} type={type}>
            {children}
        </button>

    )
}