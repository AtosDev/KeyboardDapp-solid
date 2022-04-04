import { useState } from "react";
import { ethers } from "ethers";
import ABI from "../utils/Keyboards.json";
import SecondaryBtn from "./secondary-button";
import Loader from "../components/Loader.jsx";

const TipBtn = ({index, keyboardsContract}) => { // index defines the index of the keyboard in the smartcontract array, keyboardsContract is the instance of the smartcontract
  const contractAddress = "0x22CA3Fb03A2C396fF4f2CB255523dc51278F72F3"; // this is the address of the deployed contract
  const contractABI = ABI.abi;

  const [isMining, setMining] = useState(false); // setting the mining state (loading state can also be called)

  const submitTip = async (e) => {
    if (!keyboardsContract) {
      console.error('KeyboardsContract object is required to submit a tip');
      alert('KeyboardsContract object is required to submit a tip');
      return;
    }

    setMining(true);
    try {
      const tipTxn = await keyboardsContract.tip(index, { 
        value: ethers.utils.parseEther("0.05"), // hardcoding the tipping value to 0.05 ether, {value} is the msg.value required by the contract function tip
      });
      console.log("Tip transaction started...", tipTxn.hash);

      await tipTxn.wait();
      console.log("Sent tip!", tipTxn.hash);
    } catch(e) {
      console.error("Error submitting tip", e);
    }
    finally {
      setMining(false);
    }
  };

  return (
    <SecondaryBtn onClick={submitTip}> 
      {isMining ? <Loader/> : `Tip 0.05 eth!`} {/* if isMining is true, then show the loader, else show the button */}
    </SecondaryBtn>
  ); //  {isMining ? <Loader/> : `Tip 0.05 eth! ${index}`}
};

export default TipBtn;
