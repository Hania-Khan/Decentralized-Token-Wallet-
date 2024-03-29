const express = require("express");
const Web3 = require("web3");
const bodyParser = require("body-parser");
const web3 = new Web3(
  "https://goerli.infura.io/v3/13e24b7b1c73413ba5511d029016b219"
); // Replace with your Ethereum node URL

// Import your contract ABI and address here
const {
  factoryContractABI,
  customTokenABI,
  factoryContractAddress,
} = require("../utils/constants.js");

const ownerPrivateKey =
  "6274ca49e442174e1121c6bc62e261aa5af5a02a0b32ae960e6395e7d850aab7"; // Replace with the private key of the contract owner

// Create an Ethereum account from the private key
const ownerAccount = web3.eth.accounts.privateKeyToAccount(ownerPrivateKey);
web3.eth.accounts.wallet.add(ownerAccount);

// Initialize contract instances
const userCustomTokenFactory = new web3.eth.Contract(
  factoryContractABI,
  factoryContractAddress
);

// Endpoint to create a custom token
// app.post('/createCustomToken',
const createCustomToken = async (req, res) => {
  const { name, description } = req.body;

  try {
    // Encode the transaction data
    const encodedData = userCustomTokenFactory.methods
      .createUserToken(name, description)
      .encodeABI();

    // Create a transaction object
    const txObject = {
      from: ownerAccount.address,
      to: factoryContractAddress,
      gas: 2000000, // Adjust the gas limit here
      data: encodedData,
    };

    // Sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(
      txObject,
      ownerPrivateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    res.status(200).json({
      message: "Custom token created",
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error("Error creating custom token:", error);
    res.status(500).json({ message: "Error creating custom token" });
  }
};

module.exports = {
  createCustomToken,
};
