pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "./ProtocolReserveManager.sol";

//Define the ProtocolReserveManager interface to execute revenue accumulation calculations when the protocol tokens get transfered
interface IProtocolReserveManager {
    function acctProtocolRevenueCalculation(address user) external;
}

contract GovernanceToken is ERC20Votes {
    //This token is used for protocol votes, subgraph approval votes, and accumulating protocol revenues
    
    //events to pass the deployed contract data/address to the front end or whatever contract
    event ReserveContractDeployed(address contractAddress);

    // initialize the reserveContract, to be updated when reserveContract gets deployed
    address public reserveContract = address(0);
    uint256 public s_maxSupply = 1000000000000000000000000;

    constructor() ERC20("Pivot", "PVT") ERC20Permit("Pivot") {
        _mint(msg.sender, s_maxSupply);
    }
    
    //Deploy the contract that handles the protocol revenues, passing this contract as the token that accumulates rights to revenue
    function deployReserveContract(address governorAddress) external {
        ProtocolReserveManager reserveManageContract = new ProtocolReserveManager(address(this), governorAddress);  // Deploy ProtocolReserveManager
        reserveContract = address(reserveManageContract);
        require(reserveContract != address(0), "Failed To deploy");
        emit ReserveContractDeployed(reserveContract);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
        //Override the standard ERC20 transfer function
        //Calculate the accumulated revenues with the current balances (before the transfer gets executed)
        if (_isContract(reserveContract)) {
            IProtocolReserveManager reserveManager = IProtocolReserveManager(reserveContract); 
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

    function _isContract(address _a) public returns (bool) {
        uint size;
        assembly {
            size := extcodesize(_a)
        }
        return size > 0;
    }
}