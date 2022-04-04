// script for the local purposes and contains information

const hre = require("hardhat");

async function main() {
    //const provider = hre.ethers.providers.getDefaultProvider(); // this is the default provider
    const [owner, someoneElse] = await hre.ethers.getSigners(); // Signers is just a fancy name for an Ethereum account that can call contracts
//  and make transactions. our local eth environment(hardhat) have bunch of them. we're just getting the first 2.

    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards")  // get the instance of the contract, and contract of the same name should be present in /contract directory
    const keyboardsContract = await keyboardsContractFactory.deploy();  // Deploying the contract
    await keyboardsContract.deployed();  // Wait for the contract to be deployed  
    // everything deployed to the contract is a transaction and we wait for the transaction to be mined, that is why we use await and deployed in above line

    console.log(`Deployed at ${keyboardsContract.address}`); // Print the address of the contract

    // now because the contract is deployed we can call the functions inside on it
    let keyboards = await keyboardsContract.getKeyboards();
    console.log(`using getKeyboards function before, ${keyboards}`); // before we add a keyboard, it should be empty

    //const keyboards = await keyboardsContract.createdKeyboards; // createdKeyboards which is an array variable is actually a function inside the contract, it takes an index and returns the value at that index
    
    //const keyboardTxn1 = await keyboardsContract.create("This is created by the owner"); // create is a function, which is updating the state variable createdKeyboards, for that we need transaction to be mined
    // old version of create where it only requires string as an argument

    const keyboardTxn1 = await keyboardsContract.create(0, true, "sepia");
    console.log(keyboardTxn1); // transaction object
    const TransactionReceipt = await keyboardTxn1.wait(); // wait for the transaction to be mined

    console.log(TransactionReceipt.events); // Print the events emitted by the transaction
    console.log(keyboardTxn1);

    

    //const keyboardTxn2 = await keyboardsContract.connect(someoneElse).create("This is created by someoneElse"); // connect is a function, which is used to connect to the contract, and we can use someoneElse as the signer
    
    const keyboardTxn2 = await keyboardsContract.connect(someoneElse).create(2, false, "grayscale");
    // so far we were using owner as the signer, but we can use someoneElse as the signer by using connect and then using create on top of that
    // so basically different user created a keyboard

    await keyboardTxn2.wait(); // Wait for the transaction to be mined

    keyboards = await keyboardsContract.getKeyboards();
    console.log(`using getKeyboards function after, ${keyboards}`); // after we add a keyboard, it should have a description

    keyboards = await keyboardsContract.connect(someoneElse).getKeyboards();
    console.log(`using getKeyboards function for someoneElse, ${keyboards}`); 

    // console log shows us both the keyboards created by owner and someoneElse when they requested it
    // because it is a state variable (createdKeyboards) and it belongs to the contract

    const contractBalanceBefore = await hre.ethers.provider.getBalance(keyboardsContract.address);
    const someoneBalanceBefore = await hre.ethers.provider.getBalance(someoneElse.address);

    const bbbb = await hre.ethers.provider.getBalance(owner.address);
    console.log(hre.ethers.utils.formatEther(bbbb));
    console.log(owner.address);

    console.log(`Contract balance before: ${hre.ethers.utils.formatEther(contractBalanceBefore)}`);
    console.log(`Someone balance before: ${hre.ethers.utils.formatEther(someoneBalanceBefore)}`);

    const tipTxn = await keyboardsContract.tip(1, {value: hre.ethers.utils.parseEther("1000")}); // tip the 2nd keyboard which is someoneElse as owner . tipping 1000 ether
    const tipTxnReceipt = await tipTxn.wait();

    console.log(tipTxnReceipt.events);

    //We actually make the payment in wei, which is the smallest denomination of an ether. 
    //Specifically, one ether = 1,000,000,000,000,000,000 wei (10^18). 
    //The ethers library includes some functions to convert between wei and 
    //ether so that we don’t need to try to write that number in our code! 
    //So we use parseEther("1000") to convert 1000 ether to 10^21 wei.

    const contractBalanceAfter = await hre.ethers.provider.getBalance(keyboardsContract.address);
    const someoneBalanceAfter = await hre.ethers.provider.getBalance(someoneElse.address);

    console.log(`Contract balance after: ${hre.ethers.utils.formatEther(contractBalanceAfter)}`);
    console.log(`Someone balance after: ${hre.ethers.utils.formatEther(someoneBalanceAfter)}`);

    //when we get the balance we get that in wei too, so we use formatEther to convert that to ether!
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });


// run script with: npx hardhat run scripts/start.js