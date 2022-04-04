// deploying to testnet rinkeby

async function main() {
    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
    const keyboardsContract = await keyboardsContractFactory.deploy();
    await keyboardsContract.deployed();

    console.log(`Deployed at ${keyboardsContract.address}`);

    const keyboards = await keyboardsContract.getKeyboards();
    console.log(`using getKeyboards function, ${keyboards}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    }
);

// npx hardhat run scripts/deploy.js --network rinkeby
// deployed to 0x0b5c2334d9f86dB4E73A20e4fadCa942AF9Fa8ce  (this is a string array contract we first deployed)

// Deployed at 0x3b677C59D2cF2933f4005c78D225a50A1d85762F (this is a struct contract, and second last deployed contract we will be using)

//Note that you always need to update the address and ABI together, 
//otherwise you’ll be trying to make unsupported calls to your contract and stuff will break!

// 0x22CA3Fb03A2C396fF4f2CB255523dc51278F72F3 FINAL FINAL CONTRACT ADDRESS DEPLOYED TO TESTNET RINKEBY