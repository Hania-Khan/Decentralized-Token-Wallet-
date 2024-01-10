import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/Main";
import CreateToken from "./components/CreateToken";
import CheckBalance from "./components/CheckBalance";
import TransferToken from "./components/TransferToken";
import TransactionHistory from "./components/TransactionHistory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

const App = () => {
  const [ethereumAddress, setEthereumAddress] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<SignupPage setEthereumAddress={setEthereumAddress} />} />
        <Route path="/login" element={<LoginPage setEthereumAddress={setEthereumAddress}/>} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/createToken" element={<CreateToken />} />
        <Route path="/transferTokens" element={<TransferToken />} />
        <Route path="/checkBalance/:address" element={<CheckBalance ethereumAddress={ethereumAddress} />}/>
        <Route path="/transactionHistory/:address" element={<TransactionHistory />}/>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
};

export default App;
