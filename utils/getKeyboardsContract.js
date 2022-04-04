import { ethers } from "ethers";

import ABI from "../utils/Keyboards.json";

const contractAddress = "0x22CA3Fb03A2C396fF4f2CB255523dc51278F72F3";
const contractABI = ABI.abi;

//We need to add our event handlers to the keyboardContract which we have been getting in coding(that provider, signer and new ethers.contract lines of code)
// We’ll add them like this: keyboardsContract.on('KeyboardCreated', async (keyboard) => {...} // that on represent event handler
// making it as a util to be used in other files



const getKeyboardsContract = (ethereum) => {
        if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            return new ethers.Contract(contractAddress, contractABI, signer); 
        } else {  
            return undefined; // if we don't have ethereum provider, we can't deploy the contract
        }
}

export default getKeyboardsContract