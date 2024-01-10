import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import "../Styling/SignupPage.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = ({ setEthereumAddress }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const notifySuccess = () => {
    toast.success("Registered successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const notifyExists = () => {
    toast.error("User already exists!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const notifyMetaMask = () => {
    toast.info("MetaMask connected!", {
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
      // Get Ethereum address from MetaMask
      const accountAddress = await getEthereumAddress();

      if (!accountAddress) {
        console.error("Ethereum address not available.");
        return;
      }

      // Update form data with the obtained Ethereum address
      setFormData({ ...formData, accountAddress });

      // Call your backend to register the user
      const response = await axios.post(
        "http://localhost:3000/register",
        formData
      );

      console.log(response.data.message);

      // Set Ethereum address in the parent component
      setEthereumAddress(accountAddress);
      notifySuccess(); // Notify success
      // Redirect to the main page after successful registration
      navigate("/main");
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response && error.response.status === 409) {
        notifyExists(); // Notify user already exists
      }
    }
  };

  return (
    <div className="signup-container">
      <Header />
      <form className="signup-form" onSubmit={onSubmit}>
        <h2 className="signup-heading">Signup Page</h2>
        <input
          type="text"
          name="name"
          onChange={onInputChange}
          required
          placeholder="Name"
        />
        <input
          type="text"
          name="gender"
          onChange={onInputChange}
          required
          placeholder="Gender"
        />
        <input
          type="email"
          name="email"
          onChange={onInputChange}
          required
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          onChange={onInputChange}
          required
          placeholder="Password"
        />
        <button type="submit">Sign Up</button>
      </form>
      {/* <Footer /> */}
      <ToastContainer />
    </div>
  );
};

export default SignupPage;
