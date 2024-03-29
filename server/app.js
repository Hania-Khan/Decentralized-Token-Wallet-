const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./Model/userModel.js");
const config = require("./config.js");
const Web3 = require("web3");

const app = express();
const cors = require("cors");
const userRoutes = require("./Routes/user.js");
const customTokenRoute = require("./Routes/customToken.js");
const transactionRoute = require("./Routes/transaction.js");

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use(
  session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// "mongodb+srv://wardasajjad54:i211240warda@cluster0.plfcwbj.mongodb.net/blockchainUser"
// mongodb+srv://bc_market_web:Wkb6vsTHcNa@cluster0.qrydbob.mongodb.net/

mongoose
  .connect(
    "mongodb+srv://bc_market_web:Wkb6vsTHcNa@cluster0.qrydbob.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB"));
app.use(express.urlencoded({ extended: false }));

// Ethereum configuration (replace with your Ethereum node URL)
//const ethereumNodeUrl = 'https://goerli.infura.io/v3/5ff57d5de5a940648a6b6f24241ecd15'; // Replace with your Infura project ID
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/13e24b7b1c73413ba5511d029016b219"
  )
);

app.use("/", userRoutes);
app.use("/api/createtoken", customTokenRoute);
app.use("/api/transaction", transactionRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
