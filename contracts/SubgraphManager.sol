pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SubgraphManager is Ownable {
    //poolToDepositHoldingRegistry maps pools to the locaion of their deposits, if a pool currently using this subgraph's protocol (otherwise address(0))
    mapping(address => address) public poolToDepositHoldingRegistry;

    mapping(address => uint) public poolToDepositAmounts;

    address royaltyUser;

    bool public subgraphApproved = false;

    bytes32 public subgraphQueryURI;

    event ApprovalChanged(bool isApproved);

    constructor() {
        royaltyUser = address(msg.sender);
    }

    function currentPositionBalance(address pool) public {
        address poolHoldingAddress = poolToDepositHoldingRegistry[pool];
        //Using the functions on the contract at poolHoldingAddress, pull the current balance of the position for the pool
        //Should include interest accumulated
    }

    function updateroyaltyUser(address user) external onlyOwner {
        royaltyUser = user;
    }

    function setSubgraphQueryURI(bytes32 URI) public onlyOwner {
        subgraphQueryURI = URI;
    }

    function updateRegistry(address pool, address depositHolding) internal {
        poolToDepositHoldingRegistry[pool] = depositHolding;
    }

    function updateDepositAmount(address pool, uint amount, bool isWithdraw) internal {
        if (isWithdraw == true) {
            poolToDepositAmounts[pool] -= amount;
        } else {
            poolToDepositAmounts[pool] += amount;
        }
    }

    function withdrawToPoolAddress(address destinationAddress) external onlyOwner {
        //Must be called from the pool contract
        //Takes msg.sender (pool addr) and checks the current position balance of the pool
    }

    function approveSubgraph() public onlyOwner {
        // function to be called after voting to re-approve a subgraph
        subgraphApproved = true;
        emit ApprovalChanged(true);
    }

    function disapproveSubgraph() public onlyOwner {
        // function to be called after voting to prevent subgraph from further deposits
        subgraphApproved = false;
        emit ApprovalChanged(false);
    }

    // CUSTOM FUNCTIONS BY SUBGRAPH

    //PARENT_ADDRESS is an address of a factory/registry/etc on the protocol that contains some function to verify pool-level addresses on the protocol
    address immutable PARENT_ADDRESS = address(0);

    function deposit(uint amount) public returns (bool depositSuccess) {
        //Function should be agnostic to whether deposit is from a pivot or a new user deposit within a pool


        //*******TESTING********************************************************************************
        //targetAddress will be the address of the contract where the funds will be held/deposited into
        address targetAddress = address(this);
        //*********************************************************************
        
        if (targetAddress != poolToDepositHoldingRegistry[msg.sender]) {
            updateRegistry(msg.sender, targetAddress);
            updateDepositAmount(msg.sender, amount, false);
        }
    }

    function withdraw(uint amount) public returns (bool withdrawSuccess) {
        //Function should be agnostic to whether withdraw is from a pivot or a user withdraw from pool

        updateDepositAmount(msg.sender, amount, true);
        //if withdraw amount is the entire amoun of deposits from that pool {
        updateRegistry(msg.sender, address(0));

        //}
    }

    function emergencyFundWithdraw(address pool) public {
        //Mechanism for withdrawing deposited funds when the standard pivotWithdraw() on a pool is not working

        //Instantiate the pool contract address, check if poolContract.depositStuck = true 
    }

    function getDepositAddressByPoolId(bytes32 pivotTargetPoolId) external returns (address) {
        //Conversion function that takes in the id/name/identifier of pool entity on the subgraph and returns the address with functions to stake/deposit on the protocol
        address depositAddress = address(0);

        return depositAddress;
    }

    function targetVerifier(address targetAddress) external {
        //This function calls some function on the contract at PARENT_ADDRESS to verify a target address
    }

}