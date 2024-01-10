import React, { useState } from "react";
import axios from "axios";
import "../Styling/LoginPage.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = ({ setEthereumAddress }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const notifySuccess = () => {
    toast.success("Login successful!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  // Function to get Ethereum address from MetaMask
  const getEthereumAddress = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Get the current address from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        console.log("Meta mask connected");
        return accounts[0] || null;
      } catch (error) {
        console.error("Error getting Ethereum address from MetaMask:", error);
        return null;
      }
    } else {
      console.error("MetaMask not detected.");
      return null;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const accountAddress = await getEthereumAddress();

      if (!accountAddress) {
        console.error("Ethereum address not available.");
        return;
      }

      setEthereumAddress(accountAddress);
      setFormData({ ...formData, accountAddress });

      const response = await axios.post(
        "http://localhost:3000/login",
        formData
      );

      const { message, token } = response.data;

      if (message === "Login successful") {
        console.log(message);
        notifySuccess(); // Notify success

        navigate("/main");
      } else {
        console.log(message);
        notifyError(message); // Notify login error
      }
    } catch (error) {
      console.error("Error during login:", error);
      notifyError("Error during login"); // Notify general login error
    }
  };

  return (
    <div className="login-container">
      <Header />
      <form className="login-form" onSubmit={onSubmit}>
        <h2 className="login-heading">Login Page</h2>
        <input
          type="email"
          name="email"
          onChange={onInputChange}
          required
          placeholder="Email"
        />
        <br />
        <input
          type="password"
          name="password"
          onChange={onInputChange}
          required
          placeholder="Password"
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
