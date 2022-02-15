// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    // this is a special function
    // it's called when you make a tx that doesn't specify
    // function name to call

    // External function are part of the contract interface
    // which means they can be called via contracts and other txs

    uint256 public numOfFunders;

    mapping(address => bool) private funders;
    mapping(uint256 => address) private lutFunders;

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "Cannot withdraw more than 0.1 ether"
        );
        _;
    }

    // truffle console
    // instance =

    // private -> can be accesible only within the smart contract
    // internal -> can be accessible within SC and also deprived SC

    receive() external payable {}

    function emitLog() public pure override returns (bytes32) {
        return "Hello World";
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function addFunds() external payable override {
        address funder = msg.sender;

        if (!funders[funder]) {
            funders[funder] = true;
            lutFunders[numOfFunders++] = funder;
        }
    }

    function test1() external onlyOwner {
        // some managing stuff that only admin should have access to
    }

    function test2() external onlyOwner {
        // some managing stuff that only admin should have access to
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

        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }

    // pure, view - read-only call, no gas fee -> free
    // view - it indicates that the function will not alter the storage state in any way
    // pure - even more strict, indicating that it won't even read the storage state

    // Transactions (can generate state changes) and require gas fee

    // to talk to the node on the network you can make JSON-RPC http calls
}

// const instance = await Faucet.deployed()
// instance.addFunds({value: "2000000000000000000", from: accounts[0]})
// instance.addFunds({value: "2000000000000000000", from: accounts[1]})

// instance.withdraw("50000000000000000", {from: accounts[1]})
// instance.withdraw("5000000000000000000", {from: accounts[1]})
// instance.withdraw("1000000000000000000", {from: accounts[1]})

// instance.getFunderAtIndex(0)
// instance.getAllFunders()
