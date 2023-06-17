pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./PoolManager.sol";
import "./TestToken.sol";
import "./ProtocolReserveManager.sol";

/// @title SubgraphManager
/// @author Michael Manzano
/// @notice This contract is a template for handling integrations to other protocols such as Aave, Balancer, etc
/// @dev The code until the "CUSTOMIZED FUNCTIONS" marker is uniform and should remain the same across integrations with any protocol
/// @dev The code after the "CUSTOMIZED FUNCTIONS" marker is unique to each protocol and will be audited before protocol approval
contract SubgraphManager is Ownable {
    /// @dev poolToDepositHoldingRegistry maps pools to the locaion of their deposits, if a pool currently using this subgraph's protocol (otherwise address(0))
    /// @dev As an example, on an AAVE subgraph, the deposit holding could be the DAI pool, USDC pool or WETH etc
    mapping(address => address) public poolToDepositHoldingRegistry;

    mapping(address => uint) public depositsByPool;

    mapping(address => uint) public depositsByPosition;

    mapping(address => uint) public targetFactor;

    mapping(address => uint) public poolFactor;

    mapping(address => address) poolToDepositToken;

    address royaltyUser;

    bool public subgraphApproved = false;

    event ApprovalChanged(bool isApproved);

    bytes32 public subgraphQueryURI;

    bytes32 public protocolName;

    /// @dev constuctor sets the contract deployer as royaltyUser
    /// @param protocol The name of the protocol.
    constructor(bytes32 protocol, address reserveContract) {
        royaltyUser = address(msg.sender);
        protocolName = protocol;
    }

    /// @dev Updates the royalty user address.
    /// @param user The new address of the royalty user.
    function updateroyaltyUser(address user) external onlyOwner {
        require(user != address(0), "Cannot be set to a ZERO Address");
        royaltyUser = user;
    }

    /// @dev Sets the URI for the subgraph query.
    /// @param URI The URI to set.
    function setSubgraphQueryURI(bytes32 URI) public onlyOwner {
        subgraphQueryURI = URI;
    }

    /// @dev Updates the registry by associating a pool address with a deposit holding address.
    /// @param pool The address of the pool.
    /// @param depositHolding The address of the deposit holding contract.
    function updateRegistry(address pool, address depositHolding) internal {
        poolToDepositHoldingRegistry[pool] = depositHolding;
    }

    /// @dev Updates the pool balance and simulated position balance for a given pool.
    /// @param pool The address of the pool.
    /// @param amount The amount to update the balance by.
    /// @param isDecrease A boolean flag indicating whether it is a withdrawal/loss or deposit/gain.
    function updatePoolBalance(address pool, uint poolBalanceBeforeUpdate, uint amount, bool isDecrease) internal {
        if (isDecrease == true) {
            depositsByPool[pool] = poolBalanceBeforeUpdate - amount;
        } else {
            depositsByPool[pool] = poolBalanceBeforeUpdate + amount;
        }
    }

    /// @dev This function updates the recorded balance of all Pivot deposits into a pool/market on the target protocol
    /// @param positionTargetAddress The address of the pool/market that this position pertains to
    /// @param positionBalanceBeforeUpdate The position balance before new update is made for current balance
    /// @param amount The amount the position balance is changing by
    /// @param isDecrease Whether or not the balance change is a decrease or increase
    function updatePositionBalance(address positionTargetAddress, uint positionBalanceBeforeUpdate, uint amount, bool isDecrease) internal {
        if (isDecrease == true) {
            depositsByPosition[positionTargetAddress] = positionBalanceBeforeUpdate - amount;
            simulatedPositionBalance[positionTargetAddress] = positionBalanceBeforeUpdate - amount;
        } else {
            depositsByPosition[positionTargetAddress] = positionBalanceBeforeUpdate + amount;
            simulatedPositionBalance[positionTargetAddress] = positionBalanceBeforeUpdate + amount;
        }
    }

    /// @dev Approves the subgraph after voting to re-approve it.
    function approveSubgraph() public onlyOwner {
        subgraphApproved = true;
        emit ApprovalChanged(true);
    }

    /// @dev Disapproves the subgraph after voting to prevent further deposits.
    function disapproveSubgraph() public onlyOwner {
        subgraphApproved = false;
        emit ApprovalChanged(false);
    }

    /// @dev Retrieves the current value of a pivot pool deposit including interest.
    /// @dev Get the current position value for the target and using the target factors return the value proportionate for a pool
    /// @param poolAddress The address of the pool.
    /// @return balance The current balance of the position for the pool including all interest and rewards.
    function currentPoolBalance(address poolAddress) public view returns (uint balance) {
        address target = poolToDepositHoldingRegistry[poolAddress];
        if (targetFactor[target] == 0) {
            return 0;
        }
        uint positionValue = currentPositionBalance(target);
        if (positionValue == 0) {
            return 0;
        } 
        
        uint ratio = percent(positionValue, targetFactor[target], 4);
        uint balance = (ratio * poolFactor[poolAddress]) / 10000;
        return balance;
    }

    //*******TESTING************************************************************************************************
    mapping(address => uint) public simulatedPositionBalance;
    
    function simulateInterestGained(uint amount) public {
        //instantiate pool

        address poolAddress = msg.sender;
        address target = poolToDepositHoldingRegistry[poolAddress];
        uint currentPositionValue = currentPositionBalance(target);
        uint poolBalanceBeforeUpdate = currentPoolBalance(poolAddress);
        updatePoolBalance(poolAddress, poolBalanceBeforeUpdate, amount, false);
        PoolManager poolContractInstance = PoolManager(poolAddress);

        address depositTokenAddress = poolContractInstance.depositTokenAddress();
        
        //Mint test tokens to pool
        TestToken(depositTokenAddress).mint(address(this), amount);
    }

    //***************************************************************************************************************************************************





    /// ******************************* CUSTOMIZED FUNCTIONS ***************************************************************************************************

    /// @notice PARENT_ADDRESS is an address of a factory/registry/etc on the protocol that contains some function to verify pool-level addresses on the protocol
    address immutable PARENT_ADDRESS = address(0);

    /// @dev Deposits an amount of tokens into a pool on the integrated protocol.
    /// @dev Function should be agnostic to whether deposit is from a pivot or a new user deposit within a pool
    /// @param amount The amount of tokens to deposit.
    /// @param depositTokenAddress The address of the token being deposited.
    /// @param pivotTargetAddress The address of the pivot target.
    /// @param originalSender The address of the original sender.
    /// @return depositSuccess A boolean indicating whether the deposit was successful.
    function deposit(uint amount, address depositTokenAddress, address pivotTargetAddress, address originalSender) external returns (bool depositSuccess) {
        address poolAddress = msg.sender;
        if (poolToDepositToken[poolAddress] == address(0)) {
            poolToDepositToken[poolAddress] = depositTokenAddress;
        }
        uint positionBalanceBeforeUpdate = currentPositionBalance(pivotTargetAddress);
        uint poolBalanceBeforeUpdate = currentPoolBalance(poolAddress);
        require(poolToDepositToken[poolAddress] == depositTokenAddress, "Invalid depositTokenAddress passed to deposit function");
        
        uint currentTargetFactor = targetFactor[pivotTargetAddress];
        if (currentTargetFactor == 0) {
            poolFactor[poolAddress] = 1000000;
            targetFactor[pivotTargetAddress] = 1000000;
        } else {
            uint factor = amount/positionBalanceBeforeUpdate * currentTargetFactor;
            poolFactor[poolAddress] += factor;
            targetFactor[pivotTargetAddress] += factor;
        }
        updatePoolBalance(poolAddress, poolBalanceBeforeUpdate, amount, false);
        updatePositionBalance(pivotTargetAddress, positionBalanceBeforeUpdate, amount, false);
        if (pivotTargetAddress != poolToDepositHoldingRegistry[poolAddress]) {
            updateRegistry(poolAddress, pivotTargetAddress);
        }
        /// @dev Insert here interaction with current protocol pool to deposit the funds
        // ***********TESTING***********************************************************************************************
        // No transfer from this contract but rather pass the poolAddress as the withdraw destination in the function from the deposited protocol
        bool depositSuccess = IERC20(depositTokenAddress).transferFrom(originalSender, address(this), amount);
        require(depositSuccess == true, "transferFrom failed!");
        // ******************************************************************************************************************

        return true;
    }

    /// @dev Withdraws an amount of tokens from a pool.
    /// @dev Function should be agnostic to whether withdraw is from a pivot or a user withdraw from pool
    /// @dev poolAddress must be sender, prevents users attempting to withdraw funds on behalf of a pool without calling the proper parent functions
    /// @param isPivot A boolean indicating whether it is a pivot withdrawal.
    /// @param amount The amount of tokens to withdraw.
    /// @param destination The address to which the tokens should be sent.
    /// @return withdrawSent A boolean indicating whether the withdraw was successful.
    function withdraw(bool isPivot, uint amount, address destination) external returns (bool withdrawSent) {
        require(amount != 0, "Withdraw value must be above 0");
        address poolAddress = msg.sender;
        address depositTokenAddress = poolToDepositToken[poolAddress];
        address to = destination;
        if (isPivot == true) {
            to = poolAddress;
        }
        address targetAddress = poolToDepositHoldingRegistry[poolAddress];
        uint positionBalanceBeforeUpdate = currentPositionBalance(targetAddress);
        uint poolBalanceBeforeUpdate = currentPoolBalance(poolAddress);
        uint poolDeposit = depositsByPool[poolAddress];

        uint currentTargetFactor = targetFactor[targetAddress];
        if (amount == poolBalanceBeforeUpdate) {
            targetFactor[targetAddress] -= poolFactor[poolAddress];
            poolFactor[poolAddress] = 0;
        } else {
            uint factorDiscludePool = targetFactor[targetAddress] - poolFactor[poolAddress];
            poolFactor[poolAddress] = amount/(positionBalanceBeforeUpdate/currentTargetFactor);
            targetFactor[targetAddress] = factorDiscludePool + poolFactor[poolAddress];
        }
        updatePoolBalance(poolAddress, poolBalanceBeforeUpdate, amount, true);
        updatePositionBalance(targetAddress, positionBalanceBeforeUpdate, amount, true);
        if (depositsByPool[poolAddress] <= 0) {
            updateRegistry(poolAddress, address(0));
        }

        /// @dev Insert here interaction with current protocol pool to withdraw the funds
        // ***********TESTING***********************************************************************************************
        // No transfer from this contract but rather pass the poolAddress as the withdraw destination in the function from the deposited protocol
        require(amount <= poolDeposit, "Pool Balance must be greater than or equal to requested withdraw");
        bool withdrawSuccess = IERC20(depositTokenAddress).transfer(to, amount);
        require(withdrawSuccess == true, "Transfer Failed!");
        // ******************************************************************************************************************

        return true;
    }

    /// @dev Mechanism for withdrawing deposited funds when the standard pivotWithdraw() on a pool is not working
    function emergencyFundWithdraw(address pool) public {
        /// @dev insert custom logic for contingency
    }

    /// @dev Conversion/processing view function to get an address to send funds to  
    /// @dev In the case that the pool id does not contain the address within it, additional fetches can be made to outside contracts inputting the pool id to receive the address 
    /// @param pivotTargetPoolId the id of the pool assigned by the protocol 
    /// @return depositAddress The address with functions to stake/deposit on the protocol
    function getDepositAddressByPoolId(bytes32 pivotTargetPoolId) external view returns (address depositAddress) {
        /// @dev Add customized logic here depending on the process to cut out the address from the pool id string or get the address from a protocol function
        address depositAddress = address(this);
        return depositAddress;
    }

    /// @dev Retrieves the current balance of the position for a target pool (not pivot pool).
    /// @dev Using the functions on the contract at poolHoldingAddress, pull the current balance of the position for the pool
    /// @param target The address of the target.
    /// @return balance The current balance of the position for the target including all interest and rewards.
    function currentPositionBalance(address target) public view returns (uint balance) {
        /// Integrate with protocol to read the position balance
        return simulatedPositionBalance[target];
    }

    /// @dev Calls a function on the contract at PARENT_ADDRESS to verify a target address.
    /// @param targetAddress The address to be verified.
    /// @return boolean as to whether of not the target address really does pertain to a pool that will gain interest
    function targetVerifier(address targetAddress) external returns (bool) {
        // This function calls some function on the contract at PARENT_ADDRESS to verify a target address
    }

    /// @notice Calculates the percentage of a number relative to another number.
    /// @param numerator The numerator of the fraction.
    /// @param denominator The denominator of the fraction.
    /// @param precision The precision of the percentage calculation.
    /// @return quotient The calculated percentage.
    function percent(uint numerator, uint denominator, uint precision) public view returns(uint quotient) {
		uint _numerator  = numerator * 10 ** (precision+1);
		uint _quotient =  ((_numerator / denominator) + 5) / 10;
		return ( _quotient);
	}
}