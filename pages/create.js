// new page for creating keyboards

//import { ethers } from "ethers";
import { useState, useEffect } from "react";
import PrimaryBtn from "../components/primary-button";
import Keyboard from "../components/keyboard";
import Router from "next/router";
//import ABI from "../utils/Keyboards.json";
import Loader from "../components/Loader.jsx"; // this is the loader component
import getKeyboardsContract from "../utils/getKeyboardsContract";
import { useMetaMaskAccount } from "../context/meta-mask-account-provider";

const Create = () => {
  const {ethereum} = useMetaMaskAccount(); // get the context object from the provider component and set it to the ethereum state and the connectedAccount state and the connectAccount function 

  //const [ethereum, setEthereum] = useState(undefined);
  //const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [keyboardType, setKeyboardType] = useState(0); // setting the type of keyboards we have defined in the smartcontract
  const [isPBT, setIsPBT] = useState(false); // setting the dark and light mode color
  const [filter, setFilter] = useState(""); // setting the color filter
  const [isMining, setMining] = useState(false); // setting the mining state (loading state can also be called)

  const keyboardsContract = getKeyboardsContract(ethereum); // getting the contract instance


  //const contractAddress = "0x22CA3Fb03A2C396fF4f2CB255523dc51278F72F3"; // this is the address of the deployed contract
  //const contractAbi = ABI.abi;

  /* const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("We have an authorized account: ", account);
      setConnectedAccount(account);
    } else {
      console.log("No authorized accounts yet");
    }
  }; */

  // const getConnectedAccount = async () => {
  //   if (window.ethereum) {
  //     setEthereum(window.ethereum);
  //   }

  //   if (ethereum) {
  //     const accounts = await ethereum.request({ method: "eth_accounts" });
  //     handleAccounts(accounts);
  //   }
  // };
  // useEffect(() => getConnectedAccount(), []);

  // const connectAccount = async () => {
  //   if (!ethereum) {
  //     alert("MetaMask is required to connect an account");
  //     return;
  //   }

  //   const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  //   handleAccounts(accounts);
  // };

  if (!ethereum) {
    return <p>Please install Metamask</p>; // if ethereum is not defined/MISSING that means our user don't have ethereum object which comes from metamask wallet, so tells our user to install metmask wallet
  }

  const submitCreate = async (e) => {
    e.preventDefault();

    if (!keyboardsContract) {
      console.error("KeyboardsContract object instance is required to create a keyboard");
      alert("KeyboardsContract object instance is required to create a keyboard");
      return;
    }
    setMining(true);
    try {
      // creating new type of keyboard by calling create function
      const createTxn = await keyboardsContract.create(
        keyboardType, // type of keyboard
        isPBT, // dark and light mode
        filter // color filter
      );

 
      console.log("Create transaction started...", createTxn.hash);
      await createTxn.wait(); // wait for the transaction to be mined
      console.log("Created keyboard!", createTxn.hash);
      setMining(false);

      Router.push("/"); // redirect to homepage after creating a keyboard, so they can see the new keyboard
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <form className="mt-8 flex flex-col gap-y-6">
        <div>
          {/* keyboard type */}
          <label
            htmlFor="keyboard-type" // htmlFor is used to identify the input element, when we click on label it will highlight or focus on the input element  It refers to the id of the element this label is associated with.
            className="block text-sm font-medium text-gray-300"
          >
            Keyboard Type
          </label>
          <select
            name="keyboard-type"
            id="keyboard-type" /* id should be same as htmlFor so label can work */
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setKeyboardType(e.target.value)} // when we change the keyboard type, we will set the keyboardType state to the value of the keyboard type
            value={keyboardType} // when we change the keyboard type, we will set the keyboardType state to the value of the keyboard type
          >
            <option value="0">80%</option>
            <option value="1">IS0-105</option>
            <option value="2">75%</option>
            <option value="3">60%</option>
          </select>
          {/* // select is used to create a dropdown list */}
        </div>

        <div>
          {/* keyboard keycap color */}
          <label
            htmlFor="keycap-type"
            className="block text-sm font-medium text-gray-300"
          >
            Keycap Color Type
          </label>
          <select
            name="keycap-type"
            id="keycap-type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => {
              setIsPBT(e.target.value === "pbt");
            }} // e.target.value === "pbt" is used to check if the value of the select is pbt or not, if it's not then value={} will be false, if it's pbt then value={} will be true
            value={isPBT ? "pbt" : "abs"}
          >
            <option value="abs">ABS</option>
            {/* this value will be watch by e.target.value */}
            <option value="pbt">PBT</option>
          </select>
        </div>

        <div>
          {/* keyboard color filter */}
          <label
            htmlFor="filter"
            className="block text-sm font-medium text-gray-300"
          >
            Color Filter
          </label>
          <select
            name="filter"
            id="filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setFilter(e.target.value)}
            value={filter} // when we change the keyboard type, we will set the keyboardType state to the value of the keyboard type
          >
            <option value="">None</option>
            <option value="sepia">Sepia</option>
            <option value="grayscale">Grayscale</option>
            <option value="invert">Invert</option>
            <option value="hue-rotate-90">Hue Rotate (90°)</option>
            <option value="hue-rotate-180">Hue Rotate (180°)</option>
          </select>
        </div>

        { isMining ? ( <Loader/> ) : (
        <PrimaryBtn type="submit" onClick={submitCreate}>
          Create Keyboard !!
        </PrimaryBtn>
        )}
      </form>
      <div>
        <h2 className="block text-lg font-medium text-gray-300">Preview</h2>
        <Keyboard kind={keyboardType} isPBT={isPBT} filter={filter} />
        {/* kind is the keyboard type, isPBT is the keyboard color type, filter is the keyboard color filter */}
      </div>
    </div>
  );
};

export default Create;
