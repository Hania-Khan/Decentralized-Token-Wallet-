const express = require("express");
const router = express.Router();
const Web3 = require("web3");
const jwt = require("jsonwebtoken");
const config = require("../config.js");
const { ethers } = require("ethers");
// Initialize Web3 with your Ethereum node URL
const web3 = new Web3(
  "https://goerli.infura.io/v3/13e24b7b1c73413ba5511d029016b219h"
);

// Import the ABI and contract address of your TransactionContract
const {
  transactionABI,
  transactionContractAddress,
} = require("../utils/constants.js");

// Initialize the contract instance
const contract = new web3.eth.Contract(
  transactionABI,
  transactionContractAddress
);

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token , Unauthorized" });
  }

  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "errorr Unauthorized" });
    }

    req.ethereumAddress = decoded.ethereumAddress;
    next();
  });
}

// Endpoint to check the token balance of a specific address
// router.get('/checkBalance/:address',
const checkBalance = async (req, res) => {
  const ethereumAddress = req.params.address;
  try {
    const balance = await contract.methods.checkBalance(ethereumAddress).call();
    res.json({ balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Endpoint to transfer tokens to another address
// router.post('/transferTokens',
const transferToken = async (req, res) => {
  const { to, amount } = req.body;
  try {
    // Replace with the private key of your server-controlled MetaMask account
    const privateKey =
      "6274ca49e442174e1121c6bc62e261aa5af5a02a0b32ae960e6395e7d850aab7";

    // Get the sender's address from the private key
    const senderWallet = new ethers.Wallet(privateKey);
    const senderAddress = senderWallet.address;

    // Convert the provided amount to Wei using ethers.js
    // const amountWei = ethers.utils.parseEther(amount.toString());

    // // Check if the sender's balance is greater than or equal to the amount
    // const senderBalanceWei = await contract.methods.balanceOf(senderAddress).call();
    // if (senderBalanceWei < amountWei) {
    //   return res.status(400).json({ error: "Insufficient funds" });
    // }

    // Estimate gas cost for the transaction
    const gasEstimate = await contract.methods
      .transferTokens(to, amount)
      .estimateGas();

    // Set a reasonable gas limit (slightly higher than the estimated gas cost)
    const gasLimit = gasEstimate;

    // Set a low gas price (e.g., 1 Gwei)
    const lowGasPriceGwei = 1;

    // Convert the gas price to Wei
    const lowGasPriceWei = web3.utils.toWei(lowGasPriceGwei.toString(), "gwei");

    // Build the transaction with a low gas price and reasonable gas limit
    const transaction = await contract.methods
      .transferTokens(to, amount)
      .encodeABI();
    const tx = {
      from: senderAddress,
      to: transactionContractAddress,
      gas: 0.08, // Set the gas limit
      gasPrice: lowGasPriceWei, // Set the low gas price
      data: transaction,
    };

    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // Send the signed transaction
    const txResponse = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    res.json({
      message: "Tokens transferred",
      transactionHash: txResponse.transactionHash,
    });
  } catch (error) {
    console.error(error);
    let errorMessage = "An error occurred";

    // Check if the error message indicates insufficient balance
    if (error.message.includes("ERC20: insufficient balance")) {
      errorMessage = "Insufficient funds";
    }

    res.status(500).json({ error: errorMessage });
  }
};

// Endpoint to view transaction history for a specific user
// router.get("/transactionHistory/:userAddress",
const transactionHistory = async (req, res) => {
  const ethereumAddress = req.params.address;
  try {
    const transactions = await contract.methods
      .getTransactionHistory(ethereumAddress)
      .call();

    if (transactions.length === 0) {
      // No transactions found for the address
      res.json({ message: "No recent transactions" });
    } else {
      res.json({ transactions });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  verifyToken,
  transferToken,
  transactionHistory,
  checkBalance,
};
