// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Authentication {
    uint256 public nbOfUsers;

    struct User {
        string signatureHash;
        address userAddress;
        string PAN;
    }

    mapping(address => User) private user;
    mapping(string => bool) pan_number;

    constructor() {
        nbOfUsers = 0;
    }

    function register(string memory _signature, string memory pan) public {
        require(
            user[msg.sender].userAddress ==
                address(0x0000000000000000000000000000000000000000),
            "already registered"
        );

        user[msg.sender].signatureHash = _signature;
        user[msg.sender].userAddress = msg.sender;
        user[msg.sender].PAN = pan;
        pan_number[pan] = true;
        nbOfUsers++;
    }

    function getSignatureHash() public view returns (string memory) {
        require(msg.sender == user[msg.sender].userAddress, "Not allowed");

        return user[msg.sender].signatureHash;
    }

    function checkPANDetails(string memory pan) public view returns (string memory) {
        if(pan_number[pan] == true)
            return "Exists";
        else
            return "Not Exists";
    }
    
    function getUserAddress() public view returns (address) {
        return user[msg.sender].userAddress;
    }
}