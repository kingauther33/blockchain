// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage {
    // keccak256(key . slot)
    mapping(uint256 => uint256) public aa; // slot 0
    mapping(address => uint256) public bb; // slot 1

    // keccak256(slot) + index of the item
    uint256[] public cc; // slot 2

    uint8 public a = 7; // 1 byte
    uint16 public b = 10; // 2 byte
    address public c = 0x9a6592c6ED517CDF816582a7Cd59f9EF15801DDD; // 20 bytes
    bool d = true; // 1 byte
    uint64 public e = 15; // 8 bytes
    // 32 bytes, all values will be stored in slot 3
    // 0x 0f 01 9a6592c6ed517cdf816582a7cd59f9ef15801ddd 000a 07

    uint256 public f = 200; // 32 bytes - slot 4

    uint8 public g = 40; // 1 byte - slot 5

    uint256 public h = 789; // 32 bytes - slot 6

    constructor() {
        cc.push(1);
        cc.push(10);
        cc.push(100);

        aa[2] = 4;
        aa[3] = 10;
        bb[0x9a6592c6ED517CDF816582a7Cd59f9EF15801DDD] = 100;
    }
}
