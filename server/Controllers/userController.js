const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("../config.js");
const User = require("../Model/userModel.js");
const ethers = require("ethers");

// User registration
// User registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const wallet = ethers.Wallet.createRandom();
    console.log(wallet.address);
    const ethereumAddress = wallet.address;
    console.log(ethereumAddress);
    // Create a new user with the Ethereum address

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Make sure to save the hashed password, not the plain one
      ethereumAddress, // Save the generated Ethereum address
      gender,
    });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      accountAddress: ethereumAddress,
    });
  } catch (error) {
    console.error(error);
    console.error("Error creating wallet:", error);
    res.status(400).json({ error: "An error occurred during registration" });
  }
};
// User login
// User login
const loginUser = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: "Login failed", user: user });
    }

    // Check if the Ethereum address matches
    if (user.ethereumAddress !== req.body.ethereumAddress) {
      return res
        .status(401)
        .json({ message: "Ethereum address does not match" });
    }

    req.login(user, { session: false }, (err) => {
      if (err) return next(err);

      const ethereumAddress = user.ethereumAddress;
      console.log(ethereumAddress);

      // Generate a JWT token for authentication with Ethereum address
      const token = jwt.sign(
        { username: user.username, ethereumAddress },
        config.secretKey
      );

      return res.json({ message: "Login successful", token, ethereumAddress });
    });
  })(req, res, next);
};

module.exports = {
  registerUser,
  loginUser,
};
