import React, { useState } from "react";
import axios from "axios";
import "../Styling/TransactionHistory.css";
import Header from "./Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TransactionHistory = () => {
  const [address, setAddress] = useState("");
  const [transactions, setTransactions] = useState([]);

  const notifySuccess = () => {
    toast.success("Transaction history fetched successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const notifyError = () => {
    toast.error("Error fetching transaction history", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const handleTransactionHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/transactionHistory/${address}`
      );
      setTransactions(response.data.transactions || []);
      notifySuccess(); // Notify success
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      notifyError(); // Notify error
    }
  };

  return (
    <div className="transaction-history-container">
      <Header />
      <div className="transaction-history-box">
        <h2 className="transaction-history-heading">Transaction History</h2>
        <div className="input-container">
          <label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Ethereum Address"
            />
          </label>
          <button onClick={handleTransactionHistory}>
            Get Transaction History
          </button>
        </div>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map((tx, index) => (
              <li key={index}>{tx}</li>
            ))}
          </ul>
        ) : (
          <p>No transactions found for the address</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TransactionHistory;
