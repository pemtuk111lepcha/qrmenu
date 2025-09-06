import React from "react";
import LoginPage from "./LoginPage";
import "../styles/HomePage.css";

const HomePage = ({ onViewMenu, onLogin, onSignup, onSwitch }) => (
  <div className="home-center-container">
    <div
      className="home-login-center"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/02/87/76/00/360_F_287760066_COBeYwfeWuKtWnM9lm7cDCQESYQIoaNr.jpg')",
      }}
    >
      <LoginPage onSwitch={onSwitch} onLogin={onLogin} />
    </div>
  </div>
);

export default HomePage;