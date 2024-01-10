// File: src/components/CreateToken.js

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import the toast function
import Header from "./Header";
import "../Styling/CreateToken.css";

const CreateToken = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [transactionHash, setTransactionHash] = useState(null);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/createToken",
        formData
      );

      setTransactionHash(response.data.transactionHash);

      console.log(response.data.message);

      // Display a toast message based on the API response
      if (response.data.success) {
        toast.success("Token Created Successfully");
      } else {
        toast.error("Token Not Created");
      }
    } catch (error) {
      console.error("Error creating custom token:", error);
      toast.error("Error creating custom token");
    }
  };

  return (
    <div className="create-token-container">
      <Header />
      <div className="create-token-box">
        <h2 className="create-token-heading">Create Token</h2>
        <form className="create-token-form" onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            onChange={onInputChange}
            required
            placeholder="Token Name"
          />
          <input
            type="text"
            name="description"
            onChange={onInputChange}
            required
            placeholder="Token Description"
          />
          <button type="submit">Create Token</button>
        </form>
        {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
      </div>
    </div>
  );
};

export default CreateToken;
