// File: src/components/TransferToken.js

import React, { useState } from "react";
import axios from "axios";
import "../Styling/TransferToken.css";
import Header from "./Header";
import { toast } from "react-toastify"; // Import the toast function

const TransferToken = () => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);

  const handleTransferToken = async () => {
    const data = { to, amount };
    try {
      const response = await axios.post(
        "http://localhost:3000/transferTokens",
        data
      );
      setTransactionHash(response.data.transactionHash);

      // Display a success toast when the token is transferred
      toast.success("Tokens Transferred Successfully");
    } catch (error) {
      console.error("Error transferring tokens:", error);

      // Display an error toast when there's an issue transferring tokens
      toast.error("Error Transferring Tokens");
    }
  };

  return (
    <div className="transfer-token-container">
      <Header />
      <div className="transfer-token-box">
        <h2 className="transfer-token-heading">Transfer Tokens</h2>
        <div className="input-container">
          <label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              placeholder="To Ethereum Address"
            />
          </label>
          <label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Amount"
            />
          </label>
          <button onClick={handleTransferToken}>Transfer Tokens</button>
        </div>
        {transactionHash !== null && (
          <p>Transaction Hash: {transactionHash}</p>
        )}
      </div>
    </div>
  );
};

export default TransferToken;
