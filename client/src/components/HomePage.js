import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../Styling/HomePage.css";

const HomePage = (props) => {
  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts.length > 0) {
            console.log("MetaMask is connected");
          } else {
            console.log("MetaMask is installed but no accounts are connected");
          }
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.log("MetaMask is not installed");
      }
    };

    // Call the function
    checkMetaMaskConnection();
  }, []);

  return (
    <div className="home-page">
      <Header />
      <div className="content">
        <div className="home-text">Home</div>
        <div className="button-container"></div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
