// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract PoolToken is ERC20, ERC20Burnable {
    address originalSender;
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        originalSender = msg.sender;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == originalSender, "Mint function can only be called by pool");
        _mint(to, amount);
    }

}