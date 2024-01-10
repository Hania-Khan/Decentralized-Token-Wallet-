import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import UserCustomTokenFactory from "./contracts/UserCustomTokenFactory.json"; // Import your contract artifact

const TokenFactoryComponent = () => {
  const [contract, setContract] = useState(null);
  const [userTokensCount, setUserTokensCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      // Connect to the Ethereum provider
      const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_ENDPOINT");

      // Connect to the contract using the contract address and ABI
      const contractAddress = "YOUR_CONTRACT_ADDRESS";
      const contractAbi = UserCustomTokenFactory.abi;
      const userCustomTokenFactory = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );

      // Set the contract in the state
      setContract(userCustomTokenFactory);

      // Fetch and set the user tokens count
      const tokensCount = await userCustomTokenFactory.getUserTokensCount();
      setUserTokensCount(tokensCount.toNumber());
    };

    init();
  }, []);

  const handleCreateToken = async () => {
    // Ensure the contract is initialized
    if (!contract) return;

    try {
      // Call the createToken function on the contract
      const transaction = await contract.createUserToken("TokenName", "TokenDescription");

      // Wait for the transaction to be mined
      await transaction.wait();

      // Fetch and set the updated user tokens count
      const tokensCount = await contract.getUserTokensCount();
      setUserTokensCount(tokensCount.toNumber());

      console.log("Token created successfully!");
    } catch (error) {
      console.error("Error creating token:", error.message);
    }
  };

  return (
    <div>
      <h1>User Token Factory</h1>
      <p>User Tokens Count: {userTokensCount}</p>
      <button onClick={handleCreateToken}>Create Token</button>
    </div>
  );
};

export default TokenFactoryComponent;
