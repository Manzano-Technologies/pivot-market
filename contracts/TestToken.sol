pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {

    constructor(address sender) ERC20("Pool", "POO") {
        _mint(sender, 1000 * 10 ** decimals());
    }

    function mint(address to, uint amt) public {
        _mint(to, amt);
    }
}