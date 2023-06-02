pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProtocolReserveManager.sol";
import "./TestToken.sol";
import "./PoolToken.sol";
import "./SubgraphManager.sol";
import "./Determination.sol";


import "@openzeppelin/contracts/utils/introspection/IERC165.sol";


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IPoolManager {
    function reserveContractAddress() external returns (address);
    function setReserveContractAddress(address) external;
    function title() external view returns (bytes32);
    function addDetermination(address) external;
}

contract PoolManager is Ownable, IPoolManager, IERC165 {

    event ApprovalChanged(bool isApproved);

    bool public poolApproved = true;

    //currentDepositHoldingAddress is the address where the ERC20 token deposits from this pool are currently held (ie the Compound market that is holding this pools funds)
    address currentDepositHoldingAddress = address(this);

    //Address of the subgraph contract that pertains to the protocol currently holding pool deposits
    address currentTargetSubgraphAddress = address(0);

    uint public deposited = 0;

    //The user that most recently successfully pivoted the pool funds 
    //Should be initialized upon the first deposit
    address bonusUser;

    //variable that holds the prior iterations bonusUser, who receives the payout
    address payoutBonusUser;

    address public depositTokenAddress;

    address pTokenAddress;

    //Should reserveContractAddress be set in an onlyOwner function? If DAO vote decides to upgrade the reserve contract, can be switched
    address public reserveContractAddress;
    address public determinationContractAddress = address(0);

    uint public protocolFee = 0;
    uint public bonusPayout = 0;

	//Ex 100% would be 10000
	uint protocolFeePercentage = 1000;
    uint bonusPercentage = 1000;

    bytes32 public title;

    mapping(address => mapping(uint => bytes32)) public latestSubgraphTimeseries;
    mapping(address => uint) public userToDeposits;

    address public approvedSubgraphPivotTarget;
    bytes32 approvedPoolIdPivotTarget;

    constructor(address depositToken, bytes32 titleString, address reserveContractAddressInput, address subgraphPivotTarget, bytes32 poolIdPivotTarget) {
        title = titleString;
        reserveContractAddress = reserveContractAddressInput;
        depositTokenAddress = depositToken;
        bonusUser = address(0x30CF84E121F2105e638746dCcCffebCE65B18F7C);
        setProgressStates(subgraphPivotTarget, poolIdPivotTarget);

        //function call in reserve contract must receive address of this pool contract before transfering tokens
    }

    function initializePoolTokens(address senderAddress, uint256 initialDepositAmount) external onlyOwner{
        require(pTokenAddress == address(0), "Pool pToken Already set");
        //Instantiate new pToken contract
        string memory originalSymbol = ERC20(depositTokenAddress).symbol();
        bytes memory symbol = string.concat(abi.encodePacked("p"), abi.encodePacked(originalSymbol));
        string memory titleString = string(abi.encodePacked(title));
        string memory symbolString = string(abi.encodePacked(symbol));
        PoolToken pTokenContract = new PoolToken(titleString, symbolString);
        pTokenAddress = address(pTokenContract);
        pTokenContract.mint(senderAddress, 10000000000000);
        userToDeposits[senderAddress] = initialDepositAmount;
        deposited = initialDepositAmount;
        IERC20(depositTokenAddress).approve(approvedSubgraphPivotTarget, initialDepositAmount);
    }

    function setReserveContractAddress(address contractAddress) external onlyOwner {
        reserveContractAddress = contractAddress;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        bytes4 IID = type(IPoolManager).interfaceId;
        return interfaceId ==  IID;
    }

    function getSubgraphTimeseriesDataPoint(address subgraphContractAddress, uint index) public returns (bytes32) {
        return latestSubgraphTimeseries[subgraphContractAddress][index];
    }

    function setSubgraphTimeseriesDataPoint(address subgraphContractAddress, uint index, bytes32 dataPoint) public {
        latestSubgraphTimeseries[subgraphContractAddress][index] = dataPoint;
    }

    function setProgressStates(address pivotingSubgraph, bytes32 pivotTargetPoolId) internal {
        approvedSubgraphPivotTarget = pivotingSubgraph;
        approvedPoolIdPivotTarget = pivotTargetPoolId;
    }

    function determinePivot(bytes32 pivotTargetPoolId, address subgraphContract) public returns (bool pivotExecuted) {
        //pivotTargetPoolId is the specific deposit target address. Front end will have input behind the UI

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
        executePivot = determinationContract.calculation(targetSubgraphDataset, targetDatapointCount, currentSubgraphDataset, currentDatapointCount);

        if (executePivot == false) {
            return false;
        }

        payoutBonusUser = bonusUser;
        bonusUser = msg.sender;
        //Make call to query on subgraphContract for TVL ts on the pool, see if currently meets depositable threshhold and that there has not been a significant outflow of funds recently

        setProgressStates(subgraphContract, pivotTargetPoolId);
        return true;
    }

    function addDetermination(address determinationContractAddressToAdd) external {
        require(determinationContractAddress == address(0), "This pool has already set a determination contract. A new pool must be created to implement a different contract");
        //This function gets called by the user creating the pool to add a custom contract that establishes conditions for the pool to pivot deposits into another protocol
        
        //For now, once a pool establishes a determinationContract, it cannot be changed. A new pool must be created
        //The only functions to be accessed from this contract are view. They receive input of the data pulled from the queries and output a bool of whether the pivot should happen 
        
        determinationContractAddress = determinationContractAddressToAdd;
    }

    function pivotDeposit() public returns (bool depositSuccess) {
        //When a determination is made to pivot funds into a different protocol/pool, this function executes the deposit

        //If fees have not been paid out yet from last iteration, do so before pivotDeposit
        uint feeAmount = protocolFee + bonusPayout;
        uint protocolFeeToPay = protocolFee;
        uint bonusPayoutToPay = bonusPayout;
        protocolFee = 0;
        bonusPayout = 0;
        deposited = IERC20(depositTokenAddress).balanceOf(address(this)) - feeAmount;
        
        SubgraphManager subgraphContractInstance = SubgraphManager(approvedSubgraphPivotTarget);
        address targetDepositHoldingAddress = subgraphContractInstance.getDepositAddressByPoolId(approvedPoolIdPivotTarget);

        //calls targetVerifier() function on the subgraph contract to verify that the deposit target address actually pertains to the protocol
            //This function accepts the targetAddress input
            //reads from the "PARENT_ADDRESS" immutable variable, applies an interface with the verifier call
            //Checks from whatever output that the approvedSubgraphPivotTarget is confirmed to pertain to the protocol
            //returns bool

            //Burden is on DAO members to confirm the parent address is legit and the verifier call really does confirm a deposit pool (rather than outputting user addresses)
            //An example would be getReserveData on Aave, or a registry contract etc

        //Calls the "deposit" function on the subgraph contract, sending the funds from this contract to the targetDepositHoldingAddress

        currentTargetSubgraphAddress = approvedSubgraphPivotTarget;
        currentDepositHoldingAddress = targetDepositHoldingAddress;
        setProgressStates(address(0), "");
        bool depositSuccess = subgraphContractInstance.deposit(deposited, depositTokenAddress, targetDepositHoldingAddress, address(this));
        require(depositSuccess == true, "Deposit call unsuccessful");
        feeTransfers(protocolFeeToPay, bonusPayoutToPay);
        return true;
    }

    function pivotWithdraw() public returns (bool withdrawSuccess) {
        //When a determination is made to pivot funds into a different protocol/pool, this function executes the withdraw

        require(currentDepositHoldingAddress != address(this), "Cannot pivot withdraw when funds are already in the pool contract.");

        //calls subgraph for currentPositionBalance
        //then performs state changes in PoolManager
        //Then calls the withdraw function

        SubgraphManager subgraphContractInstance = SubgraphManager(currentTargetSubgraphAddress);
        uint amount = subgraphContractInstance.currentPositionBalance(address(this));
        uint currentPoolBalance = IERC20(depositTokenAddress).balanceOf(address(this));
        
        currentTargetSubgraphAddress = address(0);
        currentDepositHoldingAddress = address(this);
        
        SubgraphManager targetSubgraphContractInstance = SubgraphManager(approvedSubgraphPivotTarget);
        address targetDepositHoldingAddress = targetSubgraphContractInstance.getDepositAddressByPoolId(approvedPoolIdPivotTarget);
        deposited = (amount + currentPoolBalance) - (protocolFee + bonusPayout);
        
        bool withdrawSuccess = subgraphContractInstance.withdraw(true, amount, address(this));
        require(withdrawSuccess == true, "pivotWithdraw unsuccessful!");
        IERC20(depositTokenAddress).approve(targetDepositHoldingAddress, deposited);

        return true;
    }

    function userDeposit(uint amount) public {
        //allows a user to add their funds into this pool

        userToDeposits[msg.sender] += amount;
        deposited += amount;

        SubgraphManager subgraphContractInstance = SubgraphManager(currentTargetSubgraphAddress);        
        uint currentPositionBalance = subgraphContractInstance.currentPositionBalance(address(this));
        uint ratio = percent(amount, currentPositionBalance, 4);

        subgraphContractInstance.deposit(amount, depositTokenAddress, currentTargetSubgraphAddress, msg.sender);

        //mint ptokens to user based on proportion of (amount)/(total # of tokens in position) = (ptokens to mint)/(ptoken.totalSupply())
		uint pTokensToMint = (ratio * IERC20(pTokenAddress).totalSupply()) / (10000);
		PoolToken pTokenContract = PoolToken(pTokenAddress);
        pTokenContract.mint(msg.sender, pTokensToMint);
    }

	//******************************************************************************************************************************************
	//TESTING, THIS FUNCTION SIMULATES POOL FEES COLLECTED, OTHER USERS DEPOSITING INTO POOL etc
	uint public simulatedPositionBalance = 2000000000000000000000;
	event EpToken(address pToken);
    event TA(uint amt);
    function simulateInterestGained(uint amt) public {
        //Call to current deposited subgraph simulateInterestGained() function
        SubgraphManager(currentTargetSubgraphAddress).simulateInterestGained(amt);
    }
	function simulateUserDeposit(uint amount) public {
		//****************************************************
		//SIMULATE DEPOSIT

        TestToken(depositTokenAddress).mint(address(this), amount);

        //add amount to userToDeposits[sender]
        userToDeposits[address(0x30CF84E121F2105e638746dCcCffebCE65B18F7C)] += amount;
        deposited += amount;

        //Instantiate Subgraph contract based on 'currentDepositHoldingAddress' address

        //get current amount of deposit tokens in deposit position
        //REPLACE WITH CALL TO SUBGRAPH CONTRACT .currentPositionBalance()
        //uint currentPositionBalance = subgraphContract.currentPositionBalance()
		//CURRENTPOSITIONBALANCE IS BEFORE THE COUNT IS UPDATED FROM THIS DEPOSIT
        //**TESTING************************************************************
        uint currentPositionBalance = simulatedPositionBalance;
        simulatedPositionBalance += amount;
		//*********************************************************************

        uint ratio = percent(amount, currentPositionBalance, 4);

        //mint ptokens to user based on proportion of (amount)/(total # of tokens in position) = (ptokens to mint)/(ptoken.totalSupply())
		uint pTokensToMint = (ratio * IERC20(pTokenAddress).totalSupply()) / (10000);
		PoolToken pTokenContract = PoolToken(pTokenAddress);
        pTokenContract.mint(address(0x30CF84E121F2105e638746dCcCffebCE65B18F7C), pTokensToMint);



		//****************************************************

	}

	//******************************************************************************************************************************************


    function userWithdraw(uint amount) public {
        //Allows user to withdraw their deposits from the pool

        uint currentPositionBalance = SubgraphManager(currentTargetSubgraphAddress).currentPositionBalance(address(this));
        require(currentPositionBalance > 0, "Position has no assets");

	    uint ratio = percent(amount, currentPositionBalance, 13);
        //Use sender pToken ratio to get a proportion of deposit tokens to tokens in position
        //get number of tokens to withdraw for user based on proportion of (amount)/(total # of tokens in position) = (ptokens to mint)/(ptoken.totalSupply())
		uint pTokensToBurn = (ratio * IERC20(pTokenAddress).totalSupply()) / (10000000000000);
		uint senderBalancePToken = IERC20(pTokenAddress).balanceOf(msg.sender);

        //Rounding math, division before multiplication is intended to truncate the pTokensToBurn value 
		uint digitToRound = pTokensToBurn - ((pTokensToBurn/10) * 10);
		if (digitToRound >= 5 && pTokensToBurn != senderBalancePToken) {
			pTokensToBurn += 1;
		}
        
		require(pTokensToBurn <= senderBalancePToken, "Withdraw amount greater than principal + interest owed to sender");

		uint applicableProfit = 0;
		if (amount > userToDeposits[msg.sender]) {
            //if amount to withdraw is greater than the recorded user deposit, levy fees on the profit
			applicableProfit = amount - userToDeposits[msg.sender];
			userToDeposits[msg.sender] = 0;
		} else {
            //if userToDeposits[msg.sender] >= amount, set userToDeposits[msg.sender] -= amount, levy no fees
			userToDeposits[msg.sender] -= amount;
		}

		uint protocolFeeIncrease = applicableProfit * protocolFeePercentage / 10000;
        uint bonusPayoutIncrease = applicableProfit * bonusPercentage / 10000;
        uint payouts = protocolFeeIncrease + bonusPayoutIncrease;
		require(amount > payouts, "Withdraw value too high after accounting for fees");

        uint amountToUser = amount - protocolFeeIncrease;
		if (protocolFeeIncrease > 0) {
            protocolFee += protocolFeeIncrease;
		}
        
        amountToUser -= bonusPayoutIncrease;
        if (bonusPayoutIncrease > 0) {
            bonusPayout += bonusPayoutIncrease;
        }

        //Funds transfered to user, fee amounts transfered to this pool
        SubgraphManager subgraphContractInstance = SubgraphManager(currentTargetSubgraphAddress);


        if (deposited >= amount) {
            deposited -= amount;
        } else {
            deposited = 0;
        }

        bool userWithdrawSuccess = subgraphContractInstance.withdraw(false, amountToUser, msg.sender);
        require(userWithdrawSuccess == true, "subgraph withdraw to user failed!");
        uint feeAmount = (amount - amountToUser);
        bool feeTransferSuccess = subgraphContractInstance.withdraw(false, feeAmount , address(this));
        require(feeTransferSuccess == true, "subgraph fee transfer failed");

        //burn ptokens
		PoolToken pTokenContract = PoolToken(pTokenAddress);
        if (pTokensToBurn <= senderBalancePToken) {
            pTokenContract.burnFrom(msg.sender, pTokensToBurn);
        }
    }

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

    function applyBonusPayout(uint bonusPayoutToPay) internal {
        bool payoutSuccess = IERC20(depositTokenAddress).transfer(payoutBonusUser, bonusPayoutToPay);
        require(payoutSuccess == true, "Transfer failed!");
    }

	function applyProtocolFees(uint protocolFeeToPay) internal {
        IERC20(depositTokenAddress).approve(reserveContractAddress, protocolFeeToPay);

        //now convert and send protocol level revenues to reserve
        ProtocolReserveManager protocolReserve = ProtocolReserveManager(reserveContractAddress);
        
        //Calls the transferRevenueAsWETH function to possibly convert to WETH and do the actual transfer
        protocolReserve.updateProtocolRevenueFactor(protocolFeeToPay);
        bool revenueTranferSuccess = protocolReserve.transferRevenueAsWETH(address(this), depositTokenAddress, protocolFeeToPay);
        require(revenueTranferSuccess == true, "Revenue Transfer failed");
    }

    function approvePool() public onlyOwner {
        // function to be called after voting to re-approve a pool
        poolApproved = true;
        emit ApprovalChanged(true);
    }

    function disapprovePool() public onlyOwner {
        // function to be called after voting to prevent pool from further deposits
        poolApproved = false;
        emit ApprovalChanged(false);
    }

    function percent(uint numerator, uint denominator, uint precision) public view returns(uint quotient) {
		uint _numerator  = numerator * 10 ** (precision+1);
		uint _quotient =  ((_numerator / denominator) + 5) / 10;
		return ( _quotient);
	}


}