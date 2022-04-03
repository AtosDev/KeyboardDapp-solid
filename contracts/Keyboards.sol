// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract Keyboards {

    constructor() {
        contractOwner = payable(msg.sender);
    }

    //string[] public createdKeyboards; // a dynamic array of strings , state variable 
    Keyboard[] public createdKeyboards; // a dynamic array of structs , state variable
    address payable contractOwner; // state variable

    // kind of keyboards present in the contract
    enum KeyboardTypes {  
        EightyPercent,
        Iso105,
        SeventyFivePercent,
        SixtyPercent
    }

    struct Keyboard { // struct for each keyboard representing their own data.
        KeyboardTypes types; // enum data type variable
        bool isPBT; // false will be ABS . ABS: LIGHT COLOR, PBT: DARK COLOR
        string filter;
        address owner;   // address of the owner of the keyboard, so we can initiate tip to owner by his address
    } 

    function getKeyboards() view public returns(Keyboard[] memory) { // returning that array of structs now
        return createdKeyboards;
    }

    // event can make our app lively with live notifications and live update so we won't have to refresh the page to see the changes
    // struct variable event
    //  emit an event whenever a user creates a keyboard
    event KeyboardCreated( 
        Keyboard keyboard 
    );

    function create(KeyboardTypes _type, bool _isPBT, string calldata _filter) external {
        Keyboard memory newKeyboard = Keyboard(_type, _isPBT, _filter, msg.sender); // creating a new keyboard struct instance, and passing the values in our struct of parameters
        createdKeyboards.push(newKeyboard); // pushing the struct variable to the array
        emit KeyboardCreated(newKeyboard); // emitting the event
    }

    //  This will allow us to tell users when they’ve received a tip on our site!
    event TipSent( 
        address recipient,  /* address of the receiver */
        uint256 amount  /* amount of ether sent */
    );


    function tip(uint256 _index) external payable {
        require(_index < createdKeyboards.length); // checking if the index is valid
        require(createdKeyboards[_index].owner != msg.sender); // checking if the sender is not the owner of the keyboard
        require(msg.value >= 0); // checking if the amount is greater than 1 wei
        address payable owner = payable(createdKeyboards[_index].owner); // getting the owner(address) of the keyboard from the array of keyboard structs. address should be made payable,
        // both variable defining the address, and the address of the owner of the keyboard should be made payable explicitly.
        uint256 Tip = msg.value - 0.01 ether; // deducting the 0.01 ether from the amount
        owner.transfer(Tip); // transferring the value to the owner of the keyboard
        payable(contractOwner).transfer(0.01 ether); // transferring the 0.01 ether to the contract owner
        emit TipSent(owner, Tip); // emitting the event
    }
}

// msg.sender is always set to the address that called the function.
// we don’t pass the address in as a new parameter

// we didn't change the parameter so we don't have to change our script/start.js file.