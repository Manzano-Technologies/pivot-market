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

    address currentDepositLocation = address(this);

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

    function addDetermination(address determinationContract) external {
        require(determinationContractAddress == address(0), "This pool has already set a determination contract. A new pool must be created to implement a different contract");
        //This function gets called by the user creating the pool to add a custom contract that establishes conditions for the pool to pivot deposits into another protocol
        
        //If currentDeposited == address(0) execute pivot to target address

        //For now, once a pool establishes a determinationContract, it cannot be changed. A new pool must be created
        
        //This function checks interface compatibility with the determination contract 
        //public mapping for subgraph data holds a max of 20(just as ex.) timeseries points, the key is the index with 0 being latest data points
        //This mapping gets overwritten every time a query is made to check a subgraph for the current yield
        //This mapping gets fetched by the subgraph
        //mapping(address subgraphAddress => mapping(uint index => bytes32 dataPoint)) latestSubgraphTimeseries

        //The only functions to be accessed from this contract are view. They receive input of the data pulled from the queries and output a bool of whether the pivot should happen 
        determinationContractAddress = determinationContract;
    }

    function pivotDeposit(address depositTarget, uint amount) internal {
        //When a determination is made to pivot funds into a different protocol/pool, this function executes the deposit
        //This function can only be called internally after determining pivot conditions have been met

        //calls targetVerifier() function on the subgraph contract to verify that the deposit target address actually pertains to the protocol
            //This function accepts the targetAddress input
            //reads from the "PARENT_ADDRESS" immutable variable, applies an interface with the verifier call
            //Checks from whatever output that the depositTarget is confirmed to pertain to the protocol
            //returns bool

            //Burden is on DAO members to confirm the parent address is legit and the verifier call really does confirm a deposit pool (rather than outputting user addresses)
            //An example would be getReserveData on Aave, or a registry contract etc


        //approves the transfer for the subgraph contract
        //Calls the "deposit" function on the subgraph contract

    }

    function pivotWithdraw(uint amount) internal {
        //When a determination is made to pivot funds into a different protocol/pool, this function executes the withdraw
        //This function can only be called internally after determining pivot conditions have been met, before a deposit is made

        //read the currentDeposited global address and passes this to the withdraw funciton
        //Call the "withdraw" function on the subgraph, sending the funds back to this contract
        //set currentDeposited to address(this)

    }

    function userDeposit(uint amount) public {
        //allows a user to add their funds into this pool
        //transferFrom msg.sender to this pool's funds
        IERC20(depositTokenAddress).transfer(address(this), amount);

        //add amount to userToDeposits[sender]
        userToDeposits[msg.sender] += amount;

        //Instantiate Subgraph contract based on 'currentDeposited' address

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

        //calls pivotDeposit() with the currentDeposited address, adding this users funds to the pool

    }

	//******************************************************************************************************************************************
	//TESTING, THIS FUNCTION SIMULATES POOL FEES COLLECTED, OTHER USERS DEPOSITING INTO POOL etc
	uint simulatedPositionBalance = 3000000000000000000000;
	event EpToken(address pToken);
	function simulatePoolActivity() public {

		//****************************************************
		//SIMULATE DEPOSIT
		uint amount = 1000000000000000000000;
		userToDeposits[0x30CF84E121F2105e638746dCcCffebCE65B18F7C] += amount;

        uint ratio = percent(amount, 1000000000000000000000, 4);

        //mint ptokens to user based on proportion of (amount)/(total # of tokens in position) = (ptokens to mint)/(ptoken.totalSupply())
		uint pTokensToMint = (ratio * IERC20(pTokenAddress).totalSupply()) / (10000);
		PoolToken pTokenContract = PoolToken(pTokenAddress);
        pTokenContract.mint(0x30CF84E121F2105e638746dCcCffebCE65B18F7C, pTokensToMint);

		//mint test (deposit) tokens to this pool manager, 1000...0000 for thi fake deposit, 1000...0000 for the fake interest gained
		TestToken(depositTokenAddress).mint(address(this), 2000000000000000000000);

		emit EpToken(pTokenAddress);
		//****************************************************

	}

	event TokenCount(uint tokens);
	function calcTokenToBurn(uint amount) public view returns (uint) {
        uint currentPositionBalance = simulatedPositionBalance;
		//*********************************************************************

		//need to figure out how many pTokens to burn
        //Get proportion of senders pToken amount to withdraw to pToken total supply
	    uint ratio = percent(amount, currentPositionBalance, 13);
        //Use sender pToken ratio to get a proportion of deposit tokens to tokens in position
        //get number of tokens to withdraw for user based on proportion of (amount)/(total # of tokens in position) = (ptokens to mint)/(ptoken.totalSupply())
		uint pTokensToBurn = (ratio * IERC20(pTokenAddress).totalSupply()) / (10000000000000);
		uint digitToRound = pTokensToBurn - ((pTokensToBurn/10) * 10);
		if (digitToRound >= 5) {
			pTokensToBurn += 1;
		}

		return pTokensToBurn;

	}

	//******************************************************************************************************************************************


    function userWithdraw(uint amount) public {
        //Allows user to withdraw their deposits from the pool
		//Amount is denominated in deposit token

        //read the currentDeposited global address
		//get current amount of deposit tokens in deposit position
        //REPLACE WITH CALL TO SUBGRAPH CONTRACT .currentPositionBalance()
        //uint currentPositionBalance = subgraphContract.currentPositionBalance()()
        //**TESTING************************************************************
		
        uint currentPositionBalance = simulatedPositionBalance;
		simulatedPositionBalance -= amount;
		//*********************************************************************

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


		//require(pTokensToBurn <= senderBalancePToken, "Withdraw amount greater than principal + interest owed to sender");

        //call the subgraph withdraw function passing the currentDeposited address and the amount of deposit tokens to withdraw
		//pivotWithdraw()
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
        pTokenContract.burnFrom(msg.sender, pTokensToBurn);

    }


	function applyProtocolFees(uint protocolFee) internal {
        //PROTOCOL FEES ARE TO BE CALCULATED AND SENT WHEN A USER BURNS THEIR pTokens.

        //Pool shall approve the reserve to spend/transact with the revenueToken the collectionTokenAmount
        IERC20(depositTokenAddress).approve(reserveContractAddress, protocolFee);

        //now convert and send protocol level revenues to reserve
        ProtocolReserveManager protocolReserve = ProtocolReserveManager(reserveContractAddress);
        protocolReserve.collectProtocolRevenue(address(this), depositTokenAddress, protocolFee);
    }

	//********************************************************************************************************************************************
    //DEPRECATED FUNCTION

    function poolInteraction(uint tokenAmt) public {

        //PROTOCOL FEES ARE TO BE CALCULATED AND SENT WHEN A USER BURNS THEIR pTokens.
        //CALCULATED BASED ON PERCENTAGE OF DIFFERENCE FROM CURRENT POSITION VALUE IN DEPOSIT TOKENS - TOKENS DEPOSITED

        
        //FILLER FOR SOME SORT OF LOGIC ON THE POOL THAT TRIGGERS A COLLECTION OF PROTOCOL FEES
        //Logic that withdraws the tokens appropriate amount of tokens that were earned as interest from whatever protocol the pool is Currently deposited in 
        //For testing purposes the pool already has the revenue token in its possession

        //For testing, using a specially deployed token. In practice this token would be USDC, DAI, etc or whatever the protocol holding the pool deposits pays out
        address revenueTokenAddress = depositTokenAddress;

        //collectionTokenAmount should be a value pulled directly from the contract, the precalculated value of the revenues to be sent to the protocol level
        //should have checks in place to make sure the collectionTokenAmount is the appropriate amount so as not to send the entireity of the pools tokens to the protocol
        uint collectionTokenAmount = tokenAmt;

        //Pool shall approve the reserve to spend/transact with the revenueToken the collectionTokenAmount
        IERC20(revenueTokenAddress).approve(reserveContractAddress, collectionTokenAmount);

        //now convert and send protocol level revenues to reserve
        ProtocolReserveManager protocolReserve = ProtocolReserveManager(reserveContractAddress);
        protocolReserve.collectProtocolRevenue(address(this), revenueTokenAddress, collectionTokenAmount);
    }
//********************************************************************************************************************************************


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