import { useState, useEffect, createContext, useContext } from "react";

const MetaMaskAccountContext = createContext(); // // create a context object to be used by all components in the application

const MetaMaskAccountProvider = ({ children }) => {
  // // create a provider component that wraps the _app.js in the application, basically wrapping all the components in the application
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);

  const setEthereumFromWindow = async () => {
    if (window.ethereum) {
      // If the chain changes then reload the page, https://docs.metamask.io/guide/ethereum-provider.html#events
      window.ethereum.on("chainChanged", async (_chainId) =>  // The MetaMask provider emits this event when the currently connected chain changes.
        window.location.reload() // reload the page
      );
      const chainId = await window.ethereum.request({ method: "eth_chainId" }); //makin a new call to eth_chainId. which gets the current chain id, returns the connected chain ID 
      const rinkebyId = "0x4"; // rinkeby chain id is 4, hexadecimal is 0x4, // See <https://docs.metamask.io/guide/ethereum-provider.html#chain-ids>
      if (chainId === rinkebyId) { // if the chain id is rinkeby id then :
        // if the chainId is Rinkeby
        setEthereum(window.ethereum); // set ethereum to window.ethereum , that enables emetaMask to be used in the app
      } else {
        alert("Please use Rinkeby network"); // else alert the user to use Rinkeby network
      }
    }
  };
  useEffect(() => setEthereumFromWindow(), []); // runs once after every initial rendering, it will set the ethereum variable

  //handleAccounts function will set the very first account in the array and only one account
  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0]; // set the connected account to the first account in the array
      console.log("We have an authorized account: ", account);
      setConnectedAccount(account);
    } else {
      console.log("No authorized accounts yet");
    }
  };

  const getConnectedAccount = async () => {
    if (ethereum) {
      const accounts = await ethereum.request({ method: "eth_accounts" }); // This requests the accounts from MetaMask that have been connected to our app
      handleAccounts(accounts); // call the handleAccounts function with the accounts array
    }
  };
  useEffect(() => getConnectedAccount()); // get the connected account will run on every render

  const connectAccount = async () => {
    try {
      if (!ethereum) {
        return alert("MetaMask is required to connect an account");
      }
      //  method: 'eth_requestAccounts',
      //This will actually open MetaMask and ask the user to give permission to connect to the app.
      //It’ll return us whichever accounts they authorized.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      handleAccounts(accounts); // call the handleAccounts function with the accounts array
    } catch (error) {
      if (error.code === 4001)
        console.log("error code 4001, User Rejected the Request");
      else {
        console.log(error);
      }
      throw new Error("No Ethereum Object found"); // throw an error if the ethereum object is not found
    }
  };

  const value = { ethereum, connectedAccount, connectAccount }; // set the value of the context to the ethereum state and the connectedAccount state and the connectAccount function

  return (
    // return the provider component
    <MetaMaskAccountContext.Provider value={value}>
      {/* // pass the provider value to the provider component */}
      {children}
      {/* // whatever we pass to the provider component will be rendered inside the provider component */}
    </MetaMaskAccountContext.Provider>
  );
};

export default MetaMaskAccountProvider;

export function useMetaMaskAccount() {
  // create a hook to use the context
  return useContext(MetaMaskAccountContext); // return the context object
}
