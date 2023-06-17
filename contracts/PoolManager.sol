pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ProtocolReserveManager.sol";
import "./TestToken.sol";
import "./PoolToken.sol";
import "./SubgraphManager.sol";
import "./Determination.sol";

interface IPoolManager {
    function reserveContractAddress() external returns (address);
    function setReserveContractAddress(address) external;
    function title() external view returns (bytes32);
    function addDetermination(address) external;
}

contract PoolManager is Ownable, IPoolManager {
    event ApprovalChanged(bool isApproved);

    bool public poolApproved = true;

    /// @notice currentDepositHoldingAddress is the address where the ERC20 token deposits from this pool are currently held 
    /// @notice Example: the Compound market that is holding this pool's funds
    address public currentDepositHoldingAddress;

    /// @notice currentTargetSubgraphAddress holds the address of the subgraph contract that pertains to the protocol currently holding pool deposits
    address public currentTargetSubgraphAddress = address(0);

    uint public deposited = 0;
    uint public depositedUserCount = 0;

    /// @dev despositedRecordedBlock only needs to be recorded when the deposited value gets set to the entire position balance, as this is used to measure interest gained in between pivots
    uint public despositedRecordedBlock = 0;

    /// @dev bonusUser most recently successfully pivoted the pool funds, will have bonus allocated after the next successful pivot
    /// @dev payoutBonusUser that holds the prior iterations bonusUser, who receives the payout
    address bonusUser;
    address payoutBonusUser;
    address public depositTokenAddress;
    address public pTokenAddress;
    address public reserveContractAddress;
    address public determinationContractAddress;

    uint cumulativeInterestPayout = 0;

    uint public protocolFee = 0;
    uint public bonusPayout = 0;

	/// @dev 100% would be 10000
	uint protocolFeePercentage = 1000;
    uint bonusPercentage = 1000;

    bytes32 public title;

    mapping(address => mapping(uint => bytes32)) public latestSubgraphTimeseries;
    mapping(address => uint) public userToDeposits;

    address public approvedSubgraphPivotTarget;
    bytes32 approvedPoolIdPivotTarget;

    /// @dev This is a viewer function to grab pool meta data for the frontend
    function poolMetaData() public view returns (bytes32 poolTitle, address depositToken, string memory tokenName, uint depositedValue, uint depositedValueInUSD) {
        string memory tokenNameToReturn = ERC20(depositTokenAddress).name();
        return (title, depositTokenAddress, tokenNameToReturn, deposited, 0);
    }

    /// @dev This is a viewer function that gets up to date numbers on counts, payouts, interest etc
    /// @return currentDepositorsCount The amount of depositors with a balance over 0 in the pool
    /// @return lifetimeInterestPayout The cumulative value of all payouts to protocol, bonus, and pool since inception of the pool
    /// @return interestGainedOnCurrentCycle The Value of interest that has currently been earned but not delegated/paid out
    /// @return blocksSincePivot The count of blocks since the most recent pivot
    function poolStatistics() external view returns (uint currentDepositorsCount, uint lifetimeInterestPayout, uint interestGainedOnCurrentCycle, uint blocksSincePivot) {
        uint positionBalance = 0;
        if (currentTargetSubgraphAddress != address(0)) {
            SubgraphManager subgraphContractInstance = SubgraphManager(currentTargetSubgraphAddress);
            positionBalance = subgraphContractInstance.currentPositionBalance(address(this));
        }
        uint interest = 0;
        if (positionBalance > deposited) {
            interest = positionBalance - deposited;
        }
        uint blockDifference = block.number - despositedRecordedBlock;
        return (depositedUserCount, cumulativeInterestPayout, interest, blockDifference);
    }


    /// SIMULATION FUNCTION REMOVE IN PRODUCTION *******************************************************************************************************************
    function simulateInterestGained(uint amt) public {
        //Call to current deposited subgraph simulateInterestGained() function
        SubgraphManager(currentTargetSubgraphAddress).simulateInterestGained(amt);
    }
    /// ************************************************************************************************************************************************************



    /// @param sender The initial sender of the transaction to deploy the pool (msg.sender from the reserve contract)
    /// @param depositToken is the address of the token that gets deposited into the protocol, is received in interest etc
    /// @param titleString is the title/name of the pool
    /// @param reserveContract is the address of the reserve contract, essentially handling revenue collection from all pools
    /// @param subgraphTarget is the address of the initial protocol/subgraph that funds are deposited to
    /// @param poolIdTarget is a bytes32 string of the pool ID (assigned by whatever protocol the pool pertains to)
    constructor(address sender, address depositToken, bytes32 titleString, address reserveContract, address subgraphTarget, bytes32 poolIdTarget) {
        require(sender != address(0), "Cannot be set to a ZERO Address");
        bonusUser = address(sender);
        require(depositToken != address(0), "Cannot be set to a ZERO Address");
        depositTokenAddress = depositToken;
        title = titleString;
        require(reserveContract != address(0), "Cannot be set to a ZERO Address");
        reserveContractAddress = reserveContract;
        setProgressStates(subgraphTarget, poolIdTarget);
    }

    /// @dev Initializes the pool tokens, mints initial supply, and sets up approvals.
    /// @param senderAddress The address of the sender initializing the pool tokens.
    /// @param initialDepositAmount The initial deposit amount.
    function initializePoolTokens(address senderAddress, uint256 initialDepositAmount) external onlyOwner {
        require(pTokenAddress == address(0), "Pool pToken already set");
        currentDepositHoldingAddress = address(this);
        string memory originalSymbol = ERC20(depositTokenAddress).symbol();
        bytes memory symbol = abi.encodePacked("p", originalSymbol);
        string memory titleString = string(abi.encodePacked(title));
        string memory symbolString = string(symbol);
        PoolToken pTokenContract = new PoolToken(titleString, symbolString);
        pTokenAddress = address(pTokenContract);
        userToDeposits[senderAddress] = initialDepositAmount;
        depositedUserCount = 1;
        deposited = initialDepositAmount;
        despositedRecordedBlock = block.number;
        pTokenContract.mint(senderAddress, 100000000000000000000);
        IERC20(depositTokenAddress).approve(approvedSubgraphPivotTarget, initialDepositAmount);
    }

    /// @dev Sets the reserve contract address.
    /// @param contractAddress The address of the reserve contract.
    function setReserveContractAddress(address contractAddress) external onlyOwner {
        require(contractAddress != address(0), "Cannot be set to a ZERO Address");
        reserveContractAddress = contractAddress;
    }

    /// @dev Retrieves a data point from the subgraph timeseries.
    /// @param subgraphContractAddress The address of the subgraph contract.
    /// @param index The index of the data point to retrieve.
    /// @return dataPoint The retrieved data point.
    function getSubgraphTimeseriesDataPoint(address subgraphContractAddress, uint index) public returns (bytes32 dataPoint) {
        return latestSubgraphTimeseries[subgraphContractAddress][index];
    }

    /// @dev Sets a data point in the subgraph timeseries.
    /// @param subgraphContractAddress The address of the subgraph contract.
    /// @param index The index of the data point to set.
    /// @param dataPoint The data point to set.
    function setSubgraphTimeseriesDataPoint(address subgraphContractAddress, uint index, bytes32 dataPoint) public {
        latestSubgraphTimeseries[subgraphContractAddress][index] = dataPoint;
    }

    /// @dev Sets the progress states for pivoting.
    /// @param pivotingSubgraph The address of the pivoting subgraph.
    /// @param pivotTargetPoolId The ID of the pivot target pool.
    function setProgressStates(address pivotingSubgraph, bytes32 pivotTargetPoolId) internal {
        approvedSubgraphPivotTarget = pivotingSubgraph;
        approvedPoolIdPivotTarget = pivotTargetPoolId;
    }

    /// @notice Determines if a pivot should be executed for the specified target pool.
    /// @dev In production this will either have the subgraph datasets input into the function from another smart contract or call the subgraphs from this function 
    /// @param pivotTargetPoolId The ID of the target pool for the pivot.
    /// @param subgraphContract The address of the subgraph contract.
    /// @return pivotExecuted Whether the pivot was executed.
    function determinePivot(bytes32 pivotTargetPoolId, address subgraphContract) public returns (bool pivotExecuted) {
        bool executePivot = false;

        uint256[] memory targetSubgraphDataset = new uint256[](10);
        targetSubgraphDataset[0] = 8;
        targetSubgraphDataset[1] = 9;
        targetSubgraphDataset[2] = 10;
        targetSubgraphDataset[3] = 11;
        targetSubgraphDataset[4] = 12;
        targetSubgraphDataset[5] = 13;
        uint targetDatapointCount = targetSubgraphDataset.length;
        uint256[] memory currentSubgraphDataset = new uint256[](10);
        currentSubgraphDataset[0] = 2;
        currentSubgraphDataset[1] = 3;
        currentSubgraphDataset[2] = 4;
        currentSubgraphDataset[3] = 5;
        currentSubgraphDataset[4] = 6;
        currentSubgraphDataset[5] = 7;
        uint currentDatapointCount = currentSubgraphDataset.length;

        DeterminationContract determinationContract = DeterminationContract(determinationContractAddress);
        executePivot = determinationContract.calculation(targetSubgraphDataset, currentSubgraphDataset);

        if (executePivot == false) {
            return false;
        }

        payoutBonusUser = bonusUser;
        bonusUser = msg.sender;

        setProgressStates(subgraphContract, pivotTargetPoolId);
        return true;
    }

    /// @notice Adds a determination contract to the pool.
    /// @dev This function is called by the pool creator to add a custom contract that establishes pivot conditions for the pool.
    /// @dev Once a pool establishes a determinationContract, it cannot be changed. A new pool must be created
    /// @param contractAddress The address of the determination contract to add.
    function addDetermination(address contractAddress) external {
        require(determinationContractAddress == address(0), "This pool has already set a determination contract. A new pool must be created to implement a different contract");
        require(contractAddress != address(0), "Cannot be set to a ZERO Address");
        determinationContractAddress = contractAddress;
    }

    /// @notice Manually called to execute the deposit after a pivot is determined and funds have been withdrawn.
    /// @notice If fees have not been paid out yet from last iteration, do so within this function call before pivotDeposit
    /// @return depositSuccess Boolean of whether the deposit was successful.
    function pivotDeposit() public returns (bool depositSuccess) {
        require(determinationContractAddress != address(0), "This pool has not set a determination contract.");
        uint feeAmount = protocolFee + bonusPayout;
        uint protocolFeeToPay = protocolFee;
        uint bonusPayoutToPay = bonusPayout;
        protocolFee = 0;
        bonusPayout = 0;
        deposited = IERC20(depositTokenAddress).balanceOf(address(this)) - feeAmount;
        despositedRecordedBlock = block.number;
        currentTargetSubgraphAddress = approvedSubgraphPivotTarget;
        SubgraphManager subgraphContractInstance = SubgraphManager(approvedSubgraphPivotTarget);
        setProgressStates(address(0), "");
        address targetDepositHoldingAddress = subgraphContractInstance.getDepositAddressByPoolId(approvedPoolIdPivotTarget);
        currentDepositHoldingAddress = targetDepositHoldingAddress;

        //calls targetVerifier() function on the subgraph contract to verify that the deposit target address actually pertains to the protocol
            //This function accepts the targetAddress input
            //reads from the "PARENT_ADDRESS" immutable variable, applies an interface with the verifier call
            //Checks from whatever output that the approvedSubgraphPivotTarget is confirmed to pertain to the protocol
            //returns bool

            //Burden is on DAO members to confirm the parent address is legit and the verifier call really does confirm a deposit pool (rather than outputting user addresses)
            //An example would be getReserveData on Aave, or a registry contract etc

        bool depositSuccess = subgraphContractInstance.deposit(deposited, depositTokenAddress, targetDepositHoldingAddress, address(this));
        require(depositSuccess == true, "Deposit call unsuccessful");
        feeTransfers(protocolFeeToPay, bonusPayoutToPay);
        return true;
    }

    /// @notice Manually called to execute the withdraw after a pivot is determined.
    /// @return withdrawSuccess Whether the withdraw was successful.
    function pivotWithdraw() public returns (bool withdrawSuccess) {
        require(determinationContractAddress != address(0), "This pool has not set a determination contract.");
        require(currentDepositHoldingAddress != address(this), "Cannot pivot withdraw when funds are already in the pool contract.");
        SubgraphManager subgraphContractInstance = SubgraphManager(currentTargetSubgraphAddress);
        uint withdrawAmount = subgraphContractInstance.currentPositionBalance(address(this));
        uint currentPoolBalance = IERC20(depositTokenAddress).balanceOf(address(this));
        currentTargetSubgraphAddress = address(0);
        currentDepositHoldingAddress = address(this);
        SubgraphManager targetSubgraphContractInstance = SubgraphManager(approvedSubgraphPivotTarget);
        address targetDepositHoldingAddress = targetSubgraphContractInstance.getDepositAddressByPoolId(approvedPoolIdPivotTarget);
        cumulativeInterestPayout += (withdrawAmount + currentPoolBalance) - deposited;
        deposited = (withdrawAmount + currentPoolBalance) - (protocolFee + bonusPayout);
        bool withdrawSuccess = subgraphContractInstance.withdraw(true, withdrawAmount, address(this));
        require(withdrawSuccess == true, "pivotWithdraw unsuccessful!");
        IERC20(depositTokenAddress).approve(targetDepositHoldingAddress, deposited);
        return true;
    }

    /// @notice Allows a user to add funds to the pool.
    /// @dev mint ptokens to user based on proportion of (amount)/(total # of tokens in position) = (ptokens to mint)/(ptoken.totalSupply())
    /// @param amount The amount of funds to deposit.
    function userDeposit(uint amount) public {
        require(determinationContractAddress != address(0), "This pool has not set a determination contract.");
        if (userToDeposits[msg.sender] == 0) {
            depositedUserCount += 1;
        }
        userToDeposits[msg.sender] += amount;
        deposited += amount;

        SubgraphManager subgraphContractInstance = SubgraphManager(currentTargetSubgraphAddress);        
        uint currentPoolBalance = subgraphContractInstance.currentPoolBalance(address(this));
        uint ratio = percent(amount, currentPoolBalance, 4);

        subgraphContractInstance.deposit(amount, depositTokenAddress, currentTargetSubgraphAddress, msg.sender);

		uint pTokensToMint = (ratio * IERC20(pTokenAddress).totalSupply()) / (10000);
		PoolToken pTokenContract = PoolToken(pTokenAddress);
        pTokenContract.mint(msg.sender, pTokensToMint);
    }

    /// @notice Allows users to withdraw their deposits from the pool.
    /// @dev Use sender pToken ratio to get a proportion of deposit tokens to tokens in position
    /// @dev digitToRound is rounding math, division before multiplication is intended to truncate the pTokensToBurn value 
    /// @dev if amount to withdraw is greater than the recorded user deposit, levy fees on the profit
    /// @param amount The amount to withdraw.
    function userWithdraw(uint amount) public {
        require(amount > 0, "Withdraw Request must be greater than 0");
        require(determinationContractAddress != address(0), "This pool has not set a determination contract.");
        uint senderBalancePToken = IERC20(pTokenAddress).balanceOf(msg.sender);
        uint pTokensToBurn = calculatePTokenBurn(amount);
		require(pTokensToBurn <= senderBalancePToken, "Withdraw amount greater than principal + interest owed to sender");
		uint applicableProfit = 0;
		uint protocolFeeIncrease = 0;
        uint bonusPayoutIncrease = 0;
        uint payouts = 0;
        if (amount > userToDeposits[msg.sender]) {
			applicableProfit = amount - userToDeposits[msg.sender];
			userToDeposits[msg.sender] = 0;
            depositedUserCount -= 1;
            protocolFeeIncrease = applicableProfit * protocolFeePercentage / 10000;
            bonusPayoutIncrease = applicableProfit * bonusPercentage / 10000;
            payouts = protocolFeeIncrease + bonusPayoutIncrease;
		    require(amount > payouts, "Withdraw value too high after accounting for fees");
		} else {
			userToDeposits[msg.sender] -= amount;
		}
        uint amountToUser = amount - protocolFeeIncrease;
		if (protocolFeeIncrease > 0) {
            protocolFee += protocolFeeIncrease;
		}
        
        amountToUser -= bonusPayoutIncrease;
        if (bonusPayoutIncrease > 0) {
            bonusPayout += bonusPayoutIncrease;
        }

        SubgraphManager subgraphContractInstance = SubgraphManager(currentTargetSubgraphAddress);
        if (deposited >= amount) {
            deposited -= amount;
        } else {
            deposited = 0;
        }
        bool userWithdrawSuccess = subgraphContractInstance.withdraw(false, amountToUser, msg.sender);
        require(userWithdrawSuccess == true, "subgraph withdraw to user failed!");
        uint feeAmount = (amount - amountToUser);
        if (feeAmount > 0) {
            bool feeTransferSuccess = subgraphContractInstance.withdraw(false, feeAmount , address(this));
            require(feeTransferSuccess == true, "subgraph fee transfer failed");
        }
		PoolToken pTokenContract = PoolToken(pTokenAddress);
        if (pTokensToBurn <= senderBalancePToken) {
            pTokenContract.burnFrom(msg.sender, pTokensToBurn);
        }
    }

    /// @notice This function is called by the front end to measure approval before token burn
    /// @param depositTokenAmount The amount of depositTokens being taken out of the pool
    /// @return The amount of tokens to burn
    function calculatePTokenBurn(uint depositTokenAmount) public view returns (uint) {
        //tokenSupply must be pTokenSupply
        uint tokenTotalSupply = IERC20(pTokenAddress).totalSupply();

        uint userBal = IERC20(pTokenAddress).balanceOf(msg.sender);
        require(userBal >= 0, "Tx sender does not have any pTokens");
        uint currentPoolBalance = SubgraphManager(currentTargetSubgraphAddress).currentPoolBalance(address(this));
        
        if (depositTokenAmount == 0) {
            return 0; 
        }
        require(currentPoolBalance >= depositTokenAmount, "Amount to burn cannot be greater than pool balance");
	    uint ratio = percent(depositTokenAmount, currentPoolBalance, 13);
        uint pTokensToBurn = (ratio * tokenTotalSupply) / (10000000000000);
        uint digitToRound = pTokensToBurn - ((pTokensToBurn/10) * 10);
		if (digitToRound >= 5 && pTokensToBurn != userBal) {
			pTokensToBurn += 1;
		}
        return pTokensToBurn;
    }

    /// @notice Performs fee transfers before making a pivot deposit
    /// @param protocolFeeToPay The protocol fee to pay.
    /// @param bonusPayoutToPay The bonus payout to pay.
    /// @return The total amount of fees transferred.
    function feeTransfers(uint protocolFeeToPay, uint bonusPayoutToPay) internal returns (uint) {
        uint amount = 0;
		if (protocolFeeToPay > 0) {
			applyProtocolFees(protocolFeeToPay);
            amount = protocolFeeToPay;
		}
        if (bonusPayoutToPay > 0) {
            applyBonusPayout(bonusPayoutToPay);
            amount += bonusPayoutToPay;
        }
        return amount;
    }

    /// @notice Applies the bonus payout to the payoutBonusUser, the bonusUser was already updated and pertains to interest currently being gained and not the revenue from last cycle
    /// @param bonusPayoutToPay The bonus amount to pay.
    function applyBonusPayout(uint bonusPayoutToPay) internal {
        bool payoutSuccess = IERC20(depositTokenAddress).transfer(payoutBonusUser, bonusPayoutToPay);
        require(payoutSuccess == true, "Transfer failed!");
    }

    /// @notice Applies the protocol fees to the reserve contract.
    /// @dev Calls the transferRevenueAsWETH function to possibly convert to WETH and do the actual transfer
    /// @param protocolFeeToPay The protocol fee amount to pay.
	function applyProtocolFees(uint protocolFeeToPay) internal {
        IERC20(depositTokenAddress).approve(reserveContractAddress, protocolFeeToPay);        
        ProtocolReserveManager protocolReserve = ProtocolReserveManager(reserveContractAddress);
        protocolReserve.updateProtocolRevenueFactor(protocolFeeToPay);
        bool revenueTranferSuccess = protocolReserve.transferRevenueAsWETH(depositTokenAddress, protocolFeeToPay);
        require(revenueTranferSuccess == true, "Revenue Transfer failed");
    }

    /// @notice Approves the pool.
    /// @dev This function should be called after voting to re-approve a pool.
    function approvePool() public onlyOwner {
        poolApproved = true;
        emit ApprovalChanged(true);
    }

    /// @notice Disapproves the pool.
    /// @dev This function should be called after voting to prevent further deposits to the pool.
    function disapprovePool() public onlyOwner {
        poolApproved = false;
        emit ApprovalChanged(false);
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