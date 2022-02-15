// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Test {
    uint256 test = 300;

    /* function test(uint256 testNum) external pure returns (uint256 data) {
        assembly {
            // let _number := 4
            // let _fmp := mload(0x40)
            mstore(0x40, 0x90)
        }

        uint8[3] memory items = [1, 2, 3];

        assembly {
            data := mload(add(0x90, 0x20))
            data := mload(add(0x90, 0x40))
        }
    } */

    function test2() external pure returns (uint256 data) {
        assembly {
            let fmp := mload(0x40)
            // hello
            mstore(add(fmp, 0x00), 0x68656C6C6F)
            data := mload(add(fmp, 0x00))
        }
    }
}
