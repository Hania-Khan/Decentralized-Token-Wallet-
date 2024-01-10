// File: src/components/TransactionPage.js

import React, { useState } from "react";
import axios from "axios";
import "../Styling/TransactionPage.css"; // Import the CSS file
import Header from "./Header";

const TransactionPage = () => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);

  const handleCheckBalance = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/transaction/checkBalance/${address}`
      );
      setMessage(`Balance: ${response.data.balance} tokens`);
    } catch (error) {
      console.error(error);
      setMessage("Error checking balance");
    }
  };

  const handleTransferTokens = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/transaction/transferTokens",
        {
          to: address,
          amount: amount,
        }
      );
      setMessage(
        `Tokens transferred. Transaction Hash: ${response.data.transactionHash}`
      );
    } catch (error) {
      console.error(error);
      setMessage("Error transferring tokens");
    }
  };

  const handleTransactionHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/transaction/transactionHistory/${address}`
      );
      setTransactionHistory(response.data.transactions || []);
    } catch (error) {
      console.error(error);
      setMessage("Error fetching transaction history");
    }
  };

  return (
    <div>
      <Header />
      <h2>Transaction Page</h2>
      <div>
        <label>
          Ethereum Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button onClick={handleCheckBalance}>Check Balance</button>
      </div>
      <div>
        <label>
          Amount:
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button onClick={handleTransferTokens}>Transfer Tokens</button>
      </div>
      <div>
        <button onClick={handleTransactionHistory}>
          View Transaction History
        </button>
      </div>
      <div>
        <p>{message}</p>
      </div>
      <div>
        <h3>Transaction History</h3>
        <ul>
          {transactionHistory.map((transaction, index) => (
            <li key={index}>{`Transaction Hash: ${transaction}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionPage;
