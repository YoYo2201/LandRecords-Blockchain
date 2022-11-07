// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract mycontract
{
    uint256 public propertyIndex;
    struct instance_of_property
    {
        uint256 propertyIndex;
        string property_location;
        string oldipfslink;
        string newipfslink;
        address[] all_property_owners_addresses;
    }

    constructor() {
        propertyIndex = 0;
    }

    mapping(address=>instance_of_property[]) the_property;
    mapping(address=>uint256) property_count;
    mapping(address=>uint256) current_property_index;
    mapping(uint256=>uint256) LocalPropertyIndex;
    mapping(uint256=>address) GlobalPropertyIndex;

    function allot_property(string memory _property_location, string memory _newipfslink) public {
        address[] memory property_owners = new address[](1);
        property_owners[0] = msg.sender;
        the_property[msg.sender].push(instance_of_property(propertyIndex, _property_location, "", _newipfslink, property_owners));
        LocalPropertyIndex[propertyIndex] = property_count[msg.sender];
        GlobalPropertyIndex[propertyIndex] = msg.sender;
        property_count[msg.sender]++;
        propertyIndex++;
    }

    function sell_property(string memory _property_location, address _new_owner_address, string memory _newipfslink, uint256 index) public
    {
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