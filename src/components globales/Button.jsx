import React from "react";
import "./Button.css";

export const Button = ({ children, onClick, className = "", ...props }) => {
  return (
    <button
      className={`minimalist-button ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
