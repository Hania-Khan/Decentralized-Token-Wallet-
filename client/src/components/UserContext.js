import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [ethereumAddress, setEthereumAddress] = useState(null);

  const setUserEthereumAddress = (address) => {
    setEthereumAddress(address);
  };

  return (
    <UserContext.Provider value={{ ethereumAddress, setUserEthereumAddress }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
