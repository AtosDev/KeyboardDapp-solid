import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { UserCircleIcon } from "@heroicons/react/solid"
import PrimaryBtn from "../components/primary-button";
import ABI from "../utils/Keyboards.json";
import Keyboard from "../components/keyboard";
import Loader from "../components/Loader.jsx"; // this is the loader component
import addressesEqual from "../utils/addressesEqual";
import TipBtn from "../components/tipBtn";
import getKeyboardsContract from "../utils/getKeyboardsContract";
import { toast } from "react-hot-toast"
import { useMetaMaskAccount } from "../context/meta-mask-account-provider";
import AddressBar from "../components/addressBar";
import {shortenAddress} from "../utils/shortenAddress";


const Home = () => {
  const {ethereum, connectedAccount, connectAccount} = useMetaMaskAccount(); // get the context object from the provider component and set it to the ethereum state and the connectedAccount state and the connectAccount function 
  //const {ethereum, connectedAccount, connectAccount} = useContext(MetaMaskAccountContext); // this will get the context from the MetaMaskAccountProvider component

  //const [ethereum, setEthereum] = useState(undefined); // storing ethereum state in a variable, as metamask sets window.ethereum to an object so we can functions on that object
  //const [connectedAccount, setConnectedAccount] = useState(undefined); // this will store the address of the connected account, will be our wallet address
  const [Keyboards, setKeyboards] = useState([]); // this will store the list of keyboards, and will be use to retreive them
  const [newKeyboard, setNewKeyboard] = useState(""); // this will store the new keyboard, and will be use to retreive it
  const [keyboardsLoading, setKeyboardsLoading] = useState(false); // this will store the loading state of the keyboards, and will be use to retreive it
  

  const keyboardsContract = getKeyboardsContract(ethereum); // this will get the keyboards contract from the utils file

  // webapp needs contactaddress and abi to be able to connect and interact with the contract
  //const contractAddress = "0x22CA3Fb03A2C396fF4f2CB255523dc51278F72F3"; // this is the address of the deployed contract
  //const contractABI = ABI.abi; // this is the ABI of the contract

  // handleAccounts function will set the very first account in the array and only one account
  /* const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      console.log("We have an authorized account", accounts[0]);
      setConnectedAccount(accounts[0]); // set the connected account to the first account in the array
    } else {
      console.log("No accounts found");
    }
  }; */

  // const getConnectedAccount = async () => {
  //   if (window.ethereum) {
  //     setEthereum(window.ethereum); // set the ethereum state to the window.ethereum
  //   }
  //   if (ethereum) {
  //     const accounts = await ethereum.request({
  //       method: "eth_accounts", // This requests the accounts from MetaMask that have been connected to our app
  //     });
  //     handleAccounts(accounts); // call the handleAccounts function with the accounts array
  //   }
  // };

  // get the connected account will run on every render
  //useEffect(() => getConnectedAccount());

    // this is not creating contract now, its just reading from the imported one
   const getKeyboards = async() => {
     if(keyboardsContract && connectedAccount) {
       setKeyboardsLoading(true); // set the keyboardsLoading state to true
       try{
       // get the keyboards from the contract
       const keyboards = await keyboardsContract.getKeyboards();
       console.log("Retrieved keyboards: ", keyboards); 

       setKeyboards(keyboards); // set the keyboards state to the keyboards array
      } catch(error) {
          console.log("Error retrieving keyboards: ", error);
      } finally {
          setKeyboardsLoading(false); // set the keyboardsLoading state to false
      }
     }
   }


    //// we have refactor the below commented code to above by making it short and concise. and avoiding duplications
  /* const getKeyboards = async () => {
    if (ethereum && connectedAccount) {
      setKeyboardsLoading(true); // set the keyboardsLoading state to true
      try {
      const provider = new ethers.providers.Web3Provider(ethereum); // web3 provider is used to interact with the blockchain,  above and here also we are using metamask as a web3provider by providing the ethereum object
      const signer = provider.getSigner(); // get signer is an ethereum account that is used sign transactions
      const keyboardsContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const keyboards = await keyboardsContract.getKeyboards(); //using getKeyboards function from the smartcontract to get the array of createdKeyabords
      console.log("Retrieved keyboards: ", keyboards);
      setKeyboards(keyboards); // setting the keyboards state to the array of keyboards


      setKeyboardsLoading(false); // set the keyboardsLoading state to false
      } catch (error) {
        console.log(error);
      }
    }
  }; */

  const addContractEventHandlers = () => {
    if(keyboardsContract && connectedAccount) { // if the keyboardsContract and connectedAccount are not undefined
      // add an "on" event handler to the contract, 
      // on event handler will run when event named KeyboardCreated is emitted on the blockchain and this will trigger the callback function and it will produce :
      // that will console log the keyboard struct from the contract and
      // if condition will execute when , the account is connected and connected account and keyboard.owner(means the person address who is creating the keyboard) are not equal then it will execute and toast notification will be shown .
      keyboardsContract.on("KeyboardCreated", async (keyboard) => { // here keyboard in parameter is the struct of the keyboard emitted by the smartcontract event
        console.log("Keyboard created: ", keyboard);
        if (connectedAccount && !addressesEqual(keyboard.owner, connectedAccount)) { // If we are connected and are not the user that created the keyboard, we show a little notification that somebody has created a keyboard. We also refresh the list of keyboards
          toast('Somebody just Created a New Keyboard!', { id : JSON.stringify(keyboard) })
        }
        await getKeyboards(); // call the getKeyboards function, to refresh the keyboards array and also the page to show us the new keyboard created by someone else or by us. In both ways this function will be called when a keyboard is created`.
      })

      // this will run when event TipSent is emitted from the smart contract on blockchain 
      keyboardsContract.on('TipSent', (recipient, amount) => {
        console.log('Tip sent to ', recipient, ' for ', amount, ' ETH');
        if(addressesEqual(recipient, connectedAccount)) { // if the recipient is equal to the connected account then we show a toast notification that we have sent a tip to the keyboard owner
          toast(`You received a tip of ${ethers.utils.formatEther(amount)} eth!`, { id: recipient + amount }) // id is used to identify the unique toast notification for every different account
        }
      })
    }
  }

  // what is { id: recipient + amount } in toast?
  // id is the id of the toast, which is the recipient + amount of the tip.

  // what is on event handler?
  // on event handler is a function that is called when an event is triggered
  // https://ethereum.stackexchange.com/questions/87643/how-to-listen-to-contract-events-using-ethers-js

  useEffect(addContractEventHandlers, [!!keyboardsContract, connectedAccount]);

  useEffect(() => {
    getKeyboards();
  }, [!!keyboardsContract ,connectedAccount]); 
   // !!keyboardsContract is used to check if the keyboardsContract is defined, and connectedAccount is used to check if the connectedAccount is defined
   // !!keyboardsContract is saying that if the contract is undefined or not available than don't work, but when the contract is defined than work
   // https://stackoverflow.com/questions/784929/what-is-the-not-not-operator-in-javascript?page=1&tab=scoredesc#tab-top

  // const connectAccount = async () => {
  //   try {
  //     if (!ethereum) {
  //       return alert("MetaMask is required to connect an account");
  //     }
  //     //  method: 'eth_requestAccounts',
  //     //This will actually open MetaMask and ask the user to give permission to connect to the app.
  //     //It’ll return us whichever accounts they authorized.
  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     handleAccounts(accounts); // call the handleAccounts function with the accounts array
  //   } catch (error) {
  //     if (error.code === 4001)
  //       console.log("error code 4001, User Rejected the Request");
  //     else {
  //       console.log(error);
  //     }
  //     throw new Error("No Ethereum Object found"); // throw an error if the ethereum object is not found
  //   }
  // };

  if (!ethereum) {
    return <p>Please install Metamask or Try Changing to Rinkeby Network</p>; // if ethereum is not defined/MISSING that means our user don't have ethereum object which comes from metamask wallet, so tells our user to install metmask wallet
  }

  /* const submitCreate = async (e) => {
    e.preventDefault(); // prevent default behaviour of the form, for type submit

    if (!connectedAccount) {
      return alert("Please connect an account to create a keyboard");
    }
    if (!ethereum) {
      return alert("Please install Metamask");
    }
    if (!newKeyboard) {
      return alert("Please enter a keyboard name");
    }

    const provider = new ethers.providers.Web3Provider(ethereum); // web3 provider is used to interact with the blockchain, above and here also we are using metamask as a web3provider by providing the ethereum object
    const signer = provider.getSigner(); // get signer will be the ethereum account that is used to sign transactions, from metamask
    const keyboardsContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const createTxn = await keyboardsContract.create(newKeyboard); // using create function from the smartcontract to create a new keyboard(description actually)
    console.log("Transaction started: ", createTxn.hash); // print the transaction hash

    await createTxn.wait(); // wait for the transaction to be mined
    console.log("Transaction mined!: ", createTxn.hash); // print the transaction hash, will return the same hash as the one above

    await getKeyboards(); // get the keyboards again
    setNewKeyboard(""); // set the new keyboard state to empty string
  }; */

  if (keyboardsLoading) {
    return <Loader /> // if keyboardsLoading is true, that means we are loading the keyboards, so we will show the loader
  }

  return (
    <div className="flex flex-col gap-4">
       {
        !connectedAccount ? ( // if there is no account connected to the website, then show the button to connect
          <PrimaryBtn onClick={connectAccount}>
            Connect to Metamask Wallet
          </PrimaryBtn>
        ) : (
          <AddressBar connectedAccount={shortenAddress(connectedAccount)}/>
        ) // if there is an account connected to the website, then show the connected account address
      }
      {Keyboards.length > 0 ? (
        <>
          <PrimaryBtn type="link" href="/create">
            Create a new keyboard
          </PrimaryBtn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            {/* We’re iterating over all the keyboards data returned and passing them into our <Keyboard> component. 
            Remember that struct is coming back in the format [3, true, 'sepia', kind: 3, isPBT: true], 
            so here we’re destructuring that into [kind, isPBT, filter]. */}
            {Keyboards.map(([keyboardType, isPBT, filter, owner], i) => (   //  reverse will show the newest keyboards first
              <div key={i + filter} className="relative">
              <Keyboard
                kind={keyboardType}
                isPBT={isPBT}
                filter={filter}
              />
              <span className="absolute top-1 right-6"> {/* absolute is used to make the text to be positioned relative to the parent */}
                {addressesEqual(owner, connectedAccount) ? // if the owner(addr1) of the keyboard is the same as the connected account(addr2), then show the react icon user button which means we cant tip ourselves
                  <UserCircleIcon className="h-5 w-5 text-indigo-300" /> : // if the owner(addr1) of the keyboard is not the same as the connected account(addr2), then show the tip button . which will initiate the tipping process to owner of the keyboard
                    <TipBtn keyboardsContract={keyboardsContract} index={i} > {/* // index is the index of the keyboard in the keyboards array */}
                      Tip!
                    </TipBtn> // we are also passing keyboardsContract instance as a prop to this component
                }
              </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">  
          <PrimaryBtn type="link" href="/create">
            Create a Keyboard!
          </PrimaryBtn>
          <p>No keyboards yet!</p>
        </div>
      )}
    </div>
  );
};

export default Home;

// because we made a usetate of ethereum and setEhereum variable, that's why we have to make getConnectedAccount function
// if we had destructure the ethereum from window than we wouldn't have to make this function

// ABI stands for “Application Binary Interface” and it’s a way of describing the interface of our contract - it tells our app what functions can be called, how they can be called and what they return.

{
  /* <div>
      {
        !connectedAccount ? ( // if there is no account connected to the website, then show the button to connect
          <PrimaryBtn onClick={connectAccount}>
            Connect to Metamask Wallet
          </PrimaryBtn>
        ) : (
          <p>Connected Account: {connectedAccount}</p>
        ) // if there is an account connected to the website, then show the connected account address
      }
    </div> */
}

// before create.js
{
  /* <div className="flex flex-col gap-y-8">
      <form className="flex flex-col gap-y-2">
        <div>
          <label
            htmlFor="keyboard-description"
            className="block text-sm font-medium text-gray-700"
          >
            Keyboard Description
          </label>
        </div>
        <input
          name="keyboard-type"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={newKeyboard} // set the new keyboard state to the value of the input
          onChange={(e) => {
            setNewKeyboard(e.target.value);
          }}
        />
        <PrimaryBtn type="submit" onClick={submitCreate}>
          Create Keyboard!
        </PrimaryBtn>
      </form>
      <div>
        {Keyboards.map(
          (
            keyboard,
            i // mapping the keyboards array we got from the smartcontract, and from Keyboard state onto the frontend
          ) => (
            <p key={i + keyboard}>{keyboard}</p>
          )
        )}
      </div>
      {
        !connectedAccount ? ( // if there is no account connected to the website, then show the button to connect
          <PrimaryBtn onClick={connectAccount}>
            Connect to Metamask Wallet
          </PrimaryBtn>
        ) : (
          <p>Connected Account: {connectedAccount}</p>
        ) // if there is an account connected to the website, then show the connected account address
      }
    </div> */
}
// this was the return statement
