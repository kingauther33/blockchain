// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./IFaucet.sol";

contract Faucet is IFaucet {
    uint256 public numOfFunders;

    mapping(address => bool) public funders;
    mapping(uint256 => address) public lutFunders;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "Cannot withdraw more than 0.1 ether"
        );
        _;
    }

    receive() external payable {}

    function addFunds() external payable override {
        address funder = msg.sender;

        if (!funders[funder]) {
            funders[funder] = true;
            lutFunders[numOfFunders++] = funder;
        }
    }

    function withdraw(uint256 withdrawAmount)
        external
        override
        limitWithdraw(withdrawAmount)
    {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint256 i = 0; i < _funders.length; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }
}
