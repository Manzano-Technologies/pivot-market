pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./PoolManager.sol";
import "./TestToken.sol";

contract SubgraphManager is Ownable {
    //poolToDepositHoldingRegistry maps pools to the locaion of their deposits, if a pool currently using this subgraph's protocol (otherwise address(0))
    //As an example, on an AAVE subgraph, the deposit holding could be the DAI pool, USDC pool or WETH etc
    mapping(address => address) public poolToDepositHoldingRegistry;

    mapping(address => uint) public poolBalance;

    mapping(address => address) poolToDepositToken;

    address royaltyUser;

    bool public subgraphApproved = false;

    bytes32 public subgraphQueryURI;

    event ApprovalChanged(bool isApproved);

    bytes32 public protocolName;

    constructor(bytes32 protocol) {
        royaltyUser = address(msg.sender);
        protocolName = protocol;
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

    function updatePoolBalance(address pool, uint amount, bool isWithdraw) internal {
        if (isWithdraw == true) {
            poolBalance[pool] -= amount;
            simulatedPositionBalance[pool] -= amount;
        } else {
            poolBalance[pool] += amount;
            simulatedPositionBalance[pool] += amount;
        }
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





    //*******TESTING************************************************************************************************
    mapping(address => uint) simulatedPositionBalance;
    
    function simulateInterestGained(uint amount) public {
        //instantiate pool

        address poolAddress = msg.sender;
        updatePoolBalance(poolAddress, amount, false);
        PoolManager poolContractInstance = PoolManager(poolAddress);

        address depositTokenAddress = poolContractInstance.depositTokenAddress();
        
        //Mint test tokens to pool
        TestToken(depositTokenAddress).mint(address(this), amount);
    }

    //***************************************************************************************************************************************************





    // CUSTOM FUNCTIONS BY SUBGRAPH

    //PARENT_ADDRESS is an address of a factory/registry/etc on the protocol that contains some function to verify pool-level addresses on the protocol
    address immutable PARENT_ADDRESS = address(0);

    function deposit(uint amount, address depositTokenAddress, address pivotTargetAddress, address originalSender) external returns (bool depositSuccess) {
        //Function should be agnostic to whether deposit is from a pivot or a new user deposit within a pool


        address poolAddress = msg.sender;
        if (poolToDepositToken[poolAddress] == address(0)) {
            poolToDepositToken[poolAddress] = depositTokenAddress;
        }

        require(poolToDepositToken[poolAddress] == depositTokenAddress, "Invalid depositTokenAddress passed to deposit function");

        //Interaction with current protocol pool to deposit the deposits

        //***********TESTING***********************************************************************************************
        //No transfer from this contract but rather pass the poolAddress as the withdraw destination in the function from the deposited protocol
        bool depositSuccess = IERC20(depositTokenAddress).transferFrom(originalSender, address(this), amount);
        require(depositSuccess == true, "transferFrom failed!");

        //******************************************************************************************************************
        
        
        updatePoolBalance(poolAddress, amount, false);
        if (pivotTargetAddress != poolToDepositHoldingRegistry[poolAddress]) {
            updateRegistry(poolAddress, pivotTargetAddress);
        }

        return true;
    }

    function withdraw(bool isPivot, uint amount, address destination) external returns (bool withdrawSent) {
        //Function should be agnostic to whether withdraw is from a pivot or a user withdraw from pool

        //poolAddress must be sender, prevents users attempting to withdraw funds on behalf of a pool without calling the proper parent functions
        address poolAddress = msg.sender;

        address depositTokenAddress = poolToDepositToken[poolAddress];

        address to = destination;
        if (isPivot == true) {
            to = poolAddress;
        }

        uint poolDeposit = poolBalance[poolAddress];

        updatePoolBalance(poolAddress, amount, true);
        if (amount >= poolBalance[poolAddress]) {
            updateRegistry(poolAddress, address(0));
        }

        //Interaction with current protocol pool to withdraw the deposits

        //***********TESTING***********************************************************************************************
        //No transfer from this contract but rather pass the poolAddress as the withdraw destination in the function from the deposited protocol
        require(amount <= poolDeposit, "Pool Balance must be greater than or equal to requested withdraw");
        bool withdrawSuccess = IERC20(depositTokenAddress).transfer(to, amount);
        require(withdrawSuccess == true, "Transfer Failed!");
        //******************************************************************************************************************
        
        return true;
    }

    function emergencyFundWithdraw(address pool) public {
        //Mechanism for withdrawing deposited funds when the standard pivotWithdraw() on a pool is not working

        //Instantiate the pool contract address, check if poolContract.depositStuck = true 
    }

    function getDepositAddressByPoolId(bytes32 pivotTargetPoolId) external returns (address) {
        //Conversion function that takes in the id/name/identifier of pool entity on the subgraph and returns the address with functions to stake/deposit on the protocol
        address depositAddress = address(this);

        return depositAddress;
    }

    function currentPositionBalance(address pool) public view returns (uint) {
        address poolHoldingAddress = poolToDepositHoldingRegistry[pool];
        uint balance = 0;
        //Using the functions on the contract at poolHoldingAddress, pull the current balance of the position for the pool
        //Should include interest accumulated
        return simulatedPositionBalance[pool];
    }

    function targetVerifier(address targetAddress) external {
        //This function calls some function on the contract at PARENT_ADDRESS to verify a target address
    }

}