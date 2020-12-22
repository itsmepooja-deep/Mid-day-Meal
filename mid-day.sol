pragma solidity ^0.4.0;

contract SimpleStorage {
    string storedData;
    event Meal(string data);

    function setData(string _data) public {
        storedData = _data;
    }

    function getData() public view returns (string) {
        return storedData;
    }
}