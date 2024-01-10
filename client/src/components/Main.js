import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateToken from "./CreateToken";
import CheckBalance from "./CheckBalance";
import TransferToken from "./TransferToken";
import TransactionHistory from "./TransactionHistory";
import "../Styling/Main.css";
import Header from "./Header";

const MainPage = () => {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Replace "0x123456" with your actual logic to get the Ethereum address
    const ethereumAddress = "0x1A4b80CCE746Cd669F129747d4e0704695D03126";

    // Navigate to the corresponding page when a tab is clicked
    if (tab === "createToken") {
      navigate("/createToken");
    } else if (tab === "checkBalance") {
      navigate(`/checkBalance/${ethereumAddress}`);
    } else if (tab === "transferToken") {
      navigate("/transferTokens");
    } else if (tab === "transactionHistory") {
      navigate(`/transactionHistory/${ethereumAddress}`);
    }
  };

  return (
    <div className="main-container">
      <Header />
      <div className="big-box">
        <div className="tab-container">
          <div
            className={`tab ${activeTab === "createToken" ? "active" : ""}`}
            onClick={() => handleTabChange("createToken")}
          >
            Create Token
          </div>
          <div
            className={`tab ${activeTab === "checkBalance" ? "active" : ""}`}
            onClick={() => handleTabChange("checkBalance")}
          >
            Check Balance
          </div>
          <div
            className={`tab ${activeTab === "transferToken" ? "active" : ""}`}
            onClick={() => handleTabChange("transferToken")}
          >
            Transfer Token
          </div>
          <div
            className={`tab ${
              activeTab === "transactionHistory" ? "active" : ""
            }`}
            onClick={() => handleTabChange("transactionHistory")}
          >
            Transaction History
          </div>
        </div>
      </div>
      <div className="content-container">
        {activeTab === "createToken" && <CreateToken />}
        {activeTab === "checkBalance" && <CheckBalance />}
        {activeTab === "transferToken" && <TransferToken />}
        {activeTab === "transactionHistory" && <TransactionHistory />}
      </div>
    </div>
  );
};

export default MainPage;
