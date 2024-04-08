// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/MyToken.sol";

contract MyTokenScript is Script {
    function setup() public {}

    function run() public {
        uint pk = vm.envUint("PK");
        vm.startBroadcast(pk);

        address account = vm.addr(pk);

        console.log("Account", account);

        MyToken mt = new MyToken();

        console.log("MyToken", address(mt));
        vm.stopBroadcast();
    }
}
