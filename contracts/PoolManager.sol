pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProtocolReserveManager.sol";
import "./TestToken.sol";
import "./PoolToken.sol";

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

    uint deposited = 0;

    //The user that most recently successfully pivoted the pool funds 
    //Should be initialized upon the first deposit
    address bonusUser = address(0);

    address depositTokenAddress;

    address pTokenAddress;

    //Should reserveContractAddress be set in an onlyOwner function? If DAO vote decides to upgrade the reserve contract, can be switched
    address public reserveContractAddress;

    address public determinationContractAddress = address(0);

	//Ex 100% would be 10000
	uint protocolFeePercentage = 1000;
    
    bytes32 public title;

    //mapping(address subgraphAddress => mapping(uint index => bytes32 dataPoint)) public latestSubgraphTimeseries;
    mapping(address => mapping(uint => bytes32)) public latestSubgraphTimeseries;

    mapping(address => uint) public userToDeposits;

    constructor(address depositToken, bytes32 titleString, address reserveContractAddressInput) {
        title = titleString;
        reserveContractAddress = reserveContractAddressInput;
        depositTokenAddress = depositToken;
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
    }

    function setReserveContractAddress(address contractAddress) external onlyOwner {
        reserveContractAddress = contractAddress;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        //This now works but how do I enforce that the pool contract actually has the functions in the interface?
        bytes4 IID = type(IPoolManager).interfaceId;
        return interfaceId ==  IID;
    }


    function getSubgraphTimeseriesDataPoint(address subgraphContractAddress, uint index) public returns (bytes32) {
        return latestSubgraphTimeseries[subgraphContractAddress][index];
    }

    function setSubgraphTimeseriesDataPoint(address subgraphContractAddress, uint index, bytes32 dataPoint) public {
        latestSubgraphTimeseries[subgraphContractAddress][index] = dataPoint;
    }

    function determinePivot(bytes32 pivotTargetPoolId, address subgraphContract) public returns (bool pivotExecuted) {
        //pivotTargetPoolId is the specific deposit target address

        bool executePivot = false;
        //**********************************************************************************************
        //THIS LOGIC WILL VARY IN PRODUCTION DEPENDING ON HOW DECO WORKS
        //Should be optimized for calculating factors on top of base yield such as impermanent loss, slippage, arbitrage etc 
        
        //Instantiate subgraphContract and confirm subgraphContract.subgraphApproved and set to targetSubgraphApproved
        bool targetSubgraphApproved = true;

        //Make call to query on subgraphContract for TVL ts on the pool, see if currently meets depositable threshhold and that there has not been a significant outflow of funds recently

        //**TESTING************************************************************
        //uint currentPositionBalance = subgraphContract.currentPositionBalance(address(this))
        uint currentPositionBalance = userToDeposits[msg.sender];
        //*********************************************************************
            
        if (currentDepositHoldingAddress != address(this)) {
            //Make call to currentTargetSubgraphAddress for latest ts data points, hold data in a variable
            //Make call to subgraphContract, hold data in a variable
            //Pass the data from these two subgraphs to the determinationContract.calculatePivot() function, returning to boolean executePivot


            bool withdrawCompleted = pivotWithdraw(currentPositionBalance);
            require(withdrawCompleted == true, "Withdraw funds unsuccessful");
        }

        bool depositComplete = pivotDeposit(currentPositionBalance, pivotTargetPoolId, subgraphContract);
        require(depositComplete == true, "Pivot deposit failed");
        bonusUser = msg.sender;

        
    }

    function addDetermination(address determinationContract) external {
        require(determinationContractAddress == address(0), "This pool has already set a determination contract. A new pool must be created to implement a different contract");
        //This function gets called by the user creating the pool to add a custom contract that establishes conditions for the pool to pivot deposits into another protocol
        
        //If currentDepositHoldingAddress == address(0) execute pivot to target address

        //For now, once a pool establishes a determinationContract, it cannot be changed. A new pool must be created
        
        //This function checks interface compatibility with the determination contract 
        //public mapping for subgraph data holds a max of 20(just as ex.) timeseries points, the key is the index with 0 being latest data points
        //This mapping gets overwritten every time a query is made to check a subgraph for the current yield
        //This mapping gets fetched by the subgraph
        //mapping(address subgraphAddress => mapping(uint index => bytes32 dataPoint)) latestSubgraphTimeseries

        //The only functions to be accessed from this contract are view. They receive input of the data pulled from the queries and output a bool of whether the pivot should happen 
        determinationContractAddress = determinationContract;
    }

    function pivotDeposit(uint amount, bytes32 pivotTargetPoolId, address depositTargetSubgraphAddress) internal returns (bool depositSuccess) {
        //When a determination is made to pivot funds into a different protocol/pool, this function executes the deposit
        //This function can only be called internally after determining pivot conditions have been met

        
        address targetDepositHoldingAddress = address(0);
        //Fetch targetDepositHoldingAddress for target pool from subgraphContract.getDepositAddressByPoolId(pivotTargetPoolId) 


        //calls targetVerifier() function on the subgraph contract to verify that the deposit target address actually pertains to the protocol
            //This function accepts the targetAddress input
            //reads from the "PARENT_ADDRESS" immutable variable, applies an interface with the verifier call
            //Checks from whatever output that the depositTargetSubgraphAddress is confirmed to pertain to the protocol
            //returns bool

            //Burden is on DAO members to confirm the parent address is legit and the verifier call really does confirm a deposit pool (rather than outputting user addresses)
            //An example would be getReserveData on Aave, or a registry contract etc


        //approves the transfer for the subgraph contract

        //Calls the "deposit" function on the subgraph contract, sending the funds from this contract to the targetDepositHoldingAddress
        //****TESTING********************************************************************************************************
        //"deposit()" on subgraph contract will return bool 
        bool depositExecuted = true;
        //*************************************************************************************************************

        require(depositExecuted == true, "Pivot deposit failed");
        deposited = amount;
        currentTargetSubgraphAddress = depositTargetSubgraphAddress;
        currentDepositHoldingAddress = targetDepositHoldingAddress;

        return true;
    }

    function pivotWithdraw(uint amount) internal returns (bool withdrawSuccess) {
        //When a determination is made to pivot funds into a different protocol/pool, this function executes the withdraw
        //This function can only be called internally after determining pivot conditions have been met, before a deposit is made

        //read the currentDepositHoldingAddress global address and passes this to the withdraw funciton

        //Call the "withdraw()" function on the subgraph, sending the funds back to this contract
        //****TESTING********************************************************************************************************
        //"withdraw()" on subgraph contract will return bool 
        bool withdrawExecuted = true;
        //*************************************************************************************************************

        require(withdrawExecuted == true, "Pivot withdraw failed");

        uint profit = amount - deposited;

        //10% of pivot profits go to bonus user
        uint bonusAmount = (profit*10)/100;

        IERC20(depositTokenAddress).transfer(bonusUser, bonusAmount);

        deposited = amount - profit;

        //Make call to "currentTargetSubgraphAddress()" contract (BEFORE UPDATING) to get the royaltyUser
        //Take owed amount to royaltyUser before passing depositing funds to next target

        currentTargetSubgraphAddress = address(0);
        currentDepositHoldingAddress = address(this);
        return true;
    }

    function userDeposit(uint amount) public {
        //allows a user to add their funds into this pool
        //transferFrom msg.sender to this pool's funds
        IERC20(depositTokenAddress).transfer(address(this), amount);

        //add amount to userToDeposits[sender]
        userToDeposits[msg.sender] += amount;
        deposited += amount;

        //Instantiate Subgraph contract based on 'currentDepositHoldingAddress' address

        //get current amount of deposit tokens in deposit position
        //REPLACE WITH CALL TO SUBGRAPH CONTRACT .currentPositionBalance()
        //uint currentPositionBalance = subgraphContract.currentPositionBalance()
		//CURRENTPOSITIONBALANCE IS BEFORE THE COUNT IS UPDATED FROM THIS DEPOSIT
        //**TESTING************************************************************
        uint currentPositionBalance = userToDeposits[msg.sender];
		//*********************************************************************

        uint ratio = percent(amount, currentPositionBalance, 4);

        //mint ptokens to user based on proportion of (amount)/(total # of tokens in position) = (ptokens to mint)/(ptoken.totalSupply())
		uint pTokensToMint = (ratio * IERC20(pTokenAddress).totalSupply()) / (10000);
		PoolToken pTokenContract = PoolToken(pTokenAddress);
        pTokenContract.mint(msg.sender, pTokensToMint);

        
    }

	//******************************************************************************************************************************************
	//TESTING, THIS FUNCTION SIMULATES POOL FEES COLLECTED, OTHER USERS DEPOSITING INTO POOL etc
	uint simulatedPositionBalance = 0;
	event EpToken(address pToken);
    event TA(uint amt);
	function simulatePoolActivity() public {
		//****************************************************
		//SIMULATE DEPOSIT
		//uint amount = 1000000000000000000000;
		//userToDeposits[0x30CF84E121F2105e638746dCcCffebCE65B18F7C] += amount;
        //deposited += amount;

        uint ratio = percent(deposited, deposited, 4);

        //mint ptokens to user based on proportion of (amount)/(total # of tokens in position) = (ptokens to mint)/(ptoken.totalSupply())
		uint pTokensToMint = (ratio * IERC20(pTokenAddress).totalSupply()) / (10000);
		PoolToken pTokenContract = PoolToken(pTokenAddress);
        pTokenContract.mint(0x30CF84E121F2105e638746dCcCffebCE65B18F7C, pTokensToMint);

		//mint test (deposit) tokens to this pool manager, 1000...0000 for thi fake deposit, 1000...0000 for the fake interest gained
		TestToken(depositTokenAddress).mint(address(this), deposited);
        deposited = deposited*2;
        simulatedPositionBalance = deposited * 3;
		emit EpToken(pTokenAddress);
		//****************************************************

	}

	//******************************************************************************************************************************************


    function userWithdraw(uint amount) public {
        //Allows user to withdraw their deposits from the pool
		//Amount is denominated in deposit token

        //read the currentDepositHoldingAddress global address
		//get current amount of deposit tokens in deposit position
        //REPLACE WITH CALL TO currentTargetSubgraphAddress .currentPositionBalance()
        //uint currentPositionBalance = subgraphContract.currentPositionBalance()()
        //**TESTING************************************************************
		
        uint currentPositionBalance = simulatedPositionBalance;
		simulatedPositionBalance -= amount;
		//*********************************************************************

        uint profit = currentPositionBalance - deposited;


        if (profit > 0) {
            uint bonusAmount = (profit*10)/100;

            //call the subgraph withdraw function to the bonusUser for bonusAmount

            currentPositionBalance -= bonusAmount; 
        }

        require(currentPositionBalance > 0, "Position has no assets");

		//need to figure out how many pTokens to burn
        //Get proportion of senders pToken amount to withdraw to pToken total supply
	    uint ratio = percent(amount, currentPositionBalance, 13);
        //Use sender pToken ratio to get a proportion of deposit tokens to tokens in position
        //get number of tokens to withdraw for user based on proportion of (amount)/(total # of tokens in position) = (ptokens to mint)/(ptoken.totalSupply())
		uint pTokensToBurn = (ratio * IERC20(pTokenAddress).totalSupply()) / (10000000000000);
		uint senderBalancePToken = IERC20(pTokenAddress).balanceOf(msg.sender);
		uint digitToRound = pTokensToBurn - ((pTokensToBurn/10) * 10);
		if (digitToRound >= 5 && pTokensToBurn != senderBalancePToken) {
			pTokensToBurn += 1;
		}

        emit TA(deposited);

		require(pTokensToBurn <= senderBalancePToken, "Withdraw amount greater than principal + interest owed to sender");

        //call the subgraph withdraw function passing the currentDepositHoldingAddress address and the amount of deposit tokens to withdraw
        //funds are received by the pool (amount)

        //Subtract amount from userToDeposits[msg.sender]
		uint priorBalance = userToDeposits[msg.sender];

		//Fees Applied
		uint feesToLevy = 0;
		if (amount > userToDeposits[msg.sender]) {
            //if amount > userToDeposits[msg.sender], set userToDeposits[msg.sender] to 0 and levy fees on the value of amount - userToDeposits[msg.sender]
			feesToLevy = amount - userToDeposits[msg.sender];
			userToDeposits[msg.sender] = 0;
		} else {
            //if userToDeposits[msg.sender] >= amount, set userToDeposits[msg.sender] -= amount, levy no fees
			userToDeposits[msg.sender] -= amount;
		}

        deposited = currentPositionBalance - amount;
		
		uint protocolFee = (feesToLevy / 10000) * protocolFeePercentage;
		uint amountToUser = amount - protocolFee;
		if (protocolFee > 0) {
			applyProtocolFees(protocolFee);
		}

        //remaining funds after fee applicable are transfered to user
		IERC20(depositTokenAddress).approve(address(this), amountToUser);
		IERC20(depositTokenAddress).transferFrom(address(this), msg.sender, amountToUser);

        //burn ptokens
		PoolToken pTokenContract = PoolToken(pTokenAddress);

        if (pTokensToBurn <= senderBalancePToken) {
            pTokenContract.burnFrom(msg.sender, pTokensToBurn);
        }

    }

	function applyProtocolFees(uint protocolFee) internal {
        //PROTOCOL FEES ARE TO BE CALCULATED AND SENT WHEN A USER BURNS THEIR pTokens.

        //Pool shall approve the reserve to spend/transact with the revenueToken the collectionTokenAmount
        IERC20(depositTokenAddress).approve(reserveContractAddress, protocolFee);

        //now convert and send protocol level revenues to reserve
        ProtocolReserveManager protocolReserve = ProtocolReserveManager(reserveContractAddress);
        protocolReserve.collectProtocolRevenue(address(this), depositTokenAddress, protocolFee);
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