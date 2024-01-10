// File: src/components/Header.js

import React from "react";
import { Link } from "react-router-dom";
import "../Styling/Header.css"; // Import the CSS file

const Header = () => {
  return (
    <div className="header">
      <h1>Blockchain</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/main">Main</Link>
        <Link to="/register">Signup</Link>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  );
};

export default Header;
