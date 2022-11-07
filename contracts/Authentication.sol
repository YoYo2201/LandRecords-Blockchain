// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
contract Authentication {
    uint256 public nbOfUsers;
    uint256 public propertyIndex;
    
    struct instance_of_property
    {
        uint256 propertyIndex;
        string property_location;
        string oldipfslink;
        string newipfslink;
        address[] all_property_owners_addresses;
    }

    struct User {
        string signatureHash;
        address userAddress;
        string PAN;
        string email;
    }

    struct Gov {
        string signatureHash;
        address govAddress;
    }

    struct Docs {
        string propertyDesc;
        string oldLink;
        string newLink;
    }

    mapping(address => User) private user;
    mapping(address => Gov) private gov;
    mapping(string => address) pan_number;
    mapping(address => Docs) private docs;
    mapping(address=>instance_of_property[]) the_property;
    mapping(address=>uint256) property_count;
    mapping(address=>uint256) current_property_index;
    mapping(uint256=>uint256) LocalPropertyIndex;
    mapping(uint256=>address) GlobalPropertyIndex;
    mapping(address=>string) ipfsHash;
    mapping(address=>uint256) OTP;
    
    constructor() {
        nbOfUsers = 0;
        propertyIndex = 0;
    }

    function register(string memory _signature, string memory pan, string memory email) public {
        require(
            user[msg.sender].userAddress ==
                address(0x0000000000000000000000000000000000000000),
            "already registered"
        );

        user[msg.sender].signatureHash = _signature;
        user[msg.sender].userAddress = msg.sender;
        user[msg.sender].PAN = pan;
        user[msg.sender].email = email;
        pan_number[pan] = msg.sender;
        nbOfUsers++;
    }

    function registerGov(string memory _signature) public {
        require(
            gov[msg.sender].govAddress ==
                address(0x0000000000000000000000000000000000000000),
            "already registered"
        );

        require(msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Not a valid Government Wallet Address!");

        gov[msg.sender].signatureHash = _signature;
        gov[msg.sender].govAddress = msg.sender;
    }

    function getUserAddressfromPAN(string memory pan) public view returns (address) {
        require(msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Not Allowed");
        return pan_number[pan];
    }

    function setOTP(uint256 otp) public {
        require(msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Not Allowed");
        OTP[msg.sender] = otp;
    }

    function getOTP(address userAddr) public view returns (uint256) {
        require(msg.sender == userAddr && msg.sender != address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Not Allowed");
        return OTP[userAddr];
    }

    function getSignatureHash() public view returns (string memory) {
        require(msg.sender == user[msg.sender].userAddress, "Not allowed");

        return user[msg.sender].signatureHash;
    }

    function getSignatureHashGov() public view returns (string memory) {
        require(msg.sender == gov[msg.sender].govAddress, "Not allowed");

        return gov[msg.sender].signatureHash;
    }

    function getEmail(address userAddr) public view returns (string memory) {
        require(msg.sender == user[msg.sender].userAddress || msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Not allowed");

        return user[userAddr].email;
    }

    function checkPANDetails(string memory pan) public view returns (string memory) {
        if(pan_number[pan] == address(0x0000000000000000000000000000000000000000))
            return "Not Exists";
        else
            return "Exists";
    }
    
    function getUserAddress() public view returns (address) {
        return user[msg.sender].userAddress;
    }

    function getGovAddress() public view returns (address) {        
        return gov[msg.sender].govAddress;
    }

    function registerDocs(string memory propertyDesc, string memory oldLink, string memory newLink) public {
        require(msg.sender == user[msg.sender].userAddress, "No such User Found!!!");
        docs[msg.sender].propertyDesc = propertyDesc;
        docs[msg.sender].oldLink = oldLink;
        docs[msg.sender].newLink = newLink;
    }

    function accessDocs(string memory pan) public view returns (string [] memory) {
        require(msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Only Government can access this!!!");
        string[] memory document = new string[](3);
        address userAddr = pan_number[pan];
        document[0] = docs[userAddr].propertyDesc;
        document[1] = docs[userAddr].oldLink;
        document[2] = docs[userAddr].newLink;
        return document;
    }

    function setIPFS(address userAddr, string memory x) public {
        require(msg.sender == userAddr && msg.sender != address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Only Account Owner is Allowed to access");
        ipfsHash[userAddr] = x;
    }
    
    function getIPFS(address userAddr) public view returns (string memory) {
        require(msg.sender == userAddr || msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Only Account Owner is Allowed to access");
        return ipfsHash[userAddr];
    }

    function allot_property(string memory _property_location, string memory _newipfslink) public {
        address[] memory property_owners = new address[](1);
        property_owners[0] = msg.sender;
        the_property[msg.sender].push(instance_of_property(propertyIndex, _property_location, "", _newipfslink, property_owners));
        LocalPropertyIndex[propertyIndex] = property_count[msg.sender];
        GlobalPropertyIndex[propertyIndex] = msg.sender;
        property_count[msg.sender]++;
        propertyIndex++;
    }

    function sell_property(string memory _property_location, string memory panNumber, string memory _newipfslink, uint256 index) public
    {
        address _new_owner_address = pan_number[panNumber];
        uint256 len = (the_property[msg.sender][LocalPropertyIndex[index]].all_property_owners_addresses).length;
        address[] memory property_owners = new address[](len+1);
        for(uint256 i=0;i<len;i++)
            property_owners[i] = the_property[msg.sender][LocalPropertyIndex[index]].all_property_owners_addresses[i];
        property_owners[len] = _new_owner_address;

        uint256 property_len = the_property[_new_owner_address].length;
        string memory _oldipfslink = the_property[msg.sender][LocalPropertyIndex[index]].newipfslink;
        the_property[_new_owner_address].push(instance_of_property(index, _property_location, _oldipfslink, _newipfslink, property_owners));
        property_count[_new_owner_address]++;

        delete the_property[msg.sender][LocalPropertyIndex[index]];

        GlobalPropertyIndex[index] = _new_owner_address;
        LocalPropertyIndex[index] = property_len;
        property_count[msg.sender]--;
    }

    function get_all_property_details(address userAddr) public view returns (string[][] memory) {
        require(msg.sender == userAddr || msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Only Admin or Account Owner is Allowed to access");
        string [][] memory properties = new string[][](property_count[userAddr]);
        for(uint256 i=0;i<property_count[userAddr];i++) {
            string [] memory property = new string[](3);
            property[0] = the_property[userAddr][i].property_location;
            property[1] = the_property[userAddr][i].oldipfslink;
            property[2] = the_property[userAddr][i].newipfslink;
            properties[i] = property;
        }
        return properties;
    }

    function get_all_property_index(address userAddr) public view returns (uint256[] memory)
    {
        require(msg.sender == userAddr || msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Only Admin or Account Owner is Allowed to access");
        uint256 [] memory properties = new uint256[](property_count[userAddr]);
        for(uint256 i=0;i<property_count[userAddr];i++) {
            properties[i] = the_property[userAddr][i].propertyIndex;
        }
        return properties;
    }
    
    function get_all_property_owners_addresses(address userAddr) public view returns (address[][] memory)
    {
        require(msg.sender == userAddr || msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Only Admin or Account Owner is Allowed to access");
        address[][] memory properties = new address[][](property_count[userAddr]);
        for(uint256 i=0;i<property_count[userAddr];i++) {
            properties[i] = the_property[userAddr][i].all_property_owners_addresses;
        }
        return properties;
    }

    function set_current_property_index(address userAddr, uint256 index) public {
        require(msg.sender == userAddr && msg.sender != address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "One Property Owner can Access");
        require(GlobalPropertyIndex[index] == userAddr, "Invalid Index");
        current_property_index[userAddr] = LocalPropertyIndex[index];
    }

    function get_property_owners_addresses(address userAddr, uint256 index) public view returns (address[] memory) {
        require(msg.sender == userAddr || msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Only Admin or Account Owner is Allowed to access");
        require(GlobalPropertyIndex[index] == userAddr, "Invalid Index");
        return the_property[userAddr][LocalPropertyIndex[index]].all_property_owners_addresses;
    }

    function get_property_details(address userAddr, uint256 index) public view returns (string[] memory) {
        require(msg.sender == userAddr || msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Only Admin or Account Owner is Allowed to access");
        require(GlobalPropertyIndex[index] == userAddr, "Invalid Index");
        string[] memory property = new string[](3);
        property[0] = the_property[userAddr][LocalPropertyIndex[index]].property_location;
        property[1] = the_property[userAddr][LocalPropertyIndex[index]].oldipfslink;
        property[2] = the_property[userAddr][LocalPropertyIndex[index]].newipfslink;
        return property;
    }

    function get_current_property_index(address userAddr) public view returns (uint256) {
        require(msg.sender == userAddr || msg.sender == address(0x9C459e648558e3E94432Ea1cE9ce9859F39290B7), "Only Admin or Account Owner is Allowed to access");
        return current_property_index[userAddr];
    }
}