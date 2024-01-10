import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import "../Styling/CheckBalance.css";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckBalance = () => {
  const { ethereumAddress } = useParams();
  const [balance, setBalance] = useState(null);

  const notifySuccess = () => {
    toast.success("Balance checked successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const notifyError = () => {
    toast.error("Error checking balance", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  useEffect(() => {
    const handleCheckBalance = async () => {
      try {
        // Call your backend to check the balance
        const response = await axios.get(
          `http://localhost:3000/checkBalance/${ethereumAddress}`
        );

        setBalance(response.data.balance);
        notifySuccess(); // Notify success
      } catch (error) {
        console.error("Error checking balance:", error);
        notifyError(); // Notify error
      }
    };

    handleCheckBalance();
  }, [ethereumAddress]);

  return (
    <div className="check-balance-container">
      <Header />
      <div className="check-balance-box">
        <h2 className="check-balance-heading">Check Balance</h2>
        <div className="input-container">
          {/* You can remove the button if you want to check balance automatically */}
          {/* <button onClick={handleCheckBalance}>Check Balance</button> */}
        </div>
        {balance !== null && <p>Balance: {balance}</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CheckBalance;
