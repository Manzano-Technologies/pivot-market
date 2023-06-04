pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "./ProtocolReserveManager.sol";

/// @title GovernanceToken
/// @author Michael Manzano
/// @notice This contract is for the protocol token that gives proposal voting rights and access to protocol fees collected
contract GovernanceToken is ERC20Votes {
    
    // initialize the reserveContract, to be updated when reserveContract gets deployed
    address public reserveContract = address(0);
    uint256 public initialSupply = 1000000000000000000000000;

    /// @notice During testing, the contract deployer gets tokens minted to their address
    constructor() ERC20("Pivot", "PVT") ERC20Permit("Pivot") {
        _mint(msg.sender, initialSupply);
    }
    
    /// @dev Save the contract address that handles the protocol revenues, this contract will be used in delegating fees earned to token holders
    function setReserveContract(address reserveContractAddress) external {
        require(reserveContract == address(0), "Reserve Contract Address has already been set");
        reserveContract = reserveContractAddress;
    }

    /// @dev When any addresses balance of tokens change, call reserve contract to calculate accumulated revenues with the current balances
    function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
        if (reserveContract != address(0)) {
            ProtocolReserveManager reserveManager = ProtocolReserveManager(reserveContract); 
            reserveManager.acctProtocolRevenueCalculation(sender);
            reserveManager.acctProtocolRevenueCalculation(recipient);
        }
        super._transfer(sender, recipient, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}