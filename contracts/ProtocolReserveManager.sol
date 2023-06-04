pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./GovernanceToken.sol";
import "./PoolManager.sol";
import "./governance_standard/GovernorContract.sol";

interface IUniswapV3Factory {
    function getPool(address,address,uint24) external view returns (address);
}

interface IGovernorContract {
    function timelock() external view returns (address);
}

interface IPoolManagerStandard {
    function reserveContractAddress() external returns (address);
    function setReserveContractAddress(address) external;
    function title() external view returns (bytes32);
}

contract ProtocolReserveManager {

    address governorContract;

    //protocolToken is the token that when held accumulates protocol revenue for the holder
    address public protocolToken;

    address constant addressWETH = address(0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f);
//    address addressWETH = address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);


    uint256 collectionNonce;

    mapping(address => uint256) public revenueAvailableByUser;

    mapping(address => uint256) public userToLastUpdateNonce;

    mapping(uint256 => uint256) public cummulativeReserveFactor;

    mapping(address => address) public uniswapPoolCache;

    //Easily pull the pool by its title
    mapping(bytes32 => address) public titleToPool;
    event TokensWithdrawn(address indexed token, address indexed recipient, uint256 amount);

    event PoolContractDeployed(address contractAddress);

    function initialize(address token, address governorAddress) external {
        cummulativeReserveFactor[0] = 0;
        protocolToken = token;
        governorContract = governorAddress;
    }

    function deployPoolContract(address depositToken, bytes32 title, uint256 initialDepositAmount, address subgraphPivotTarget, bytes32 poolIdPivotTarget) public {        
        PoolManager poolManagerContract = new PoolManager(depositToken, title, address(this), subgraphPivotTarget, poolIdPivotTarget);  // Deploy PoolManager
        address poolManagerAddress = address(poolManagerContract);
        TestToken testToken = TestToken(depositToken);
        //testToken.mint(address(this), initialDepositAmount);
        bool deployTransferSuccess = IERC20(depositToken).transferFrom(msg.sender, poolManagerAddress, initialDepositAmount);
        require(deployTransferSuccess == true, "transferFrom failed!");

        poolManagerContract.initializePoolTokens(msg.sender, initialDepositAmount);

        address timelock = IGovernorContract(governorContract).timelock();
        poolManagerContract.transferOwnership(timelock);

        titleToPool[title] = poolManagerAddress;
        require(poolManagerAddress != address(0), "Failed To deploy");

        emit PoolContractDeployed(poolManagerAddress);
    }

    //TESTING FUNCTION ****************************************************************************************************************************************
    //execute separate contract with ERC 20 token, and mint to this (pool) address 

    event TestTokenDeployed(address tokenAddress);
    function deployTestToken() public {
        TestToken testToken = new TestToken(msg.sender);  // Deploy TestToken
        emit TestTokenDeployed(address(testToken));
    }
    //****************************************************************************************************************************************

    function acctProtocolRevenueCalculation(address user) public returns (uint256) {
        //This function gets executed to calculate the **PROTOCOL LEVEL** revenues accumulated for the sender since the last calculation
        //Called every time user/protocol token holder attempts to withdraw revenues
        //Updates the calculations to give current amounts available
        //Called every token transfer to track updates to user accumulationsbefore the balance is updated

        //Function takes the most recently recorded cummulativeReserveFactor and subtracts the reserve factor of the last time the user revenue was updated. 
        //This gets the per unit protocol revenues for a token holder since holding that amount of tokens
        //updates the user collection nonce

        uint256 userProtocolTokenBalance = IERC20(protocolToken).balanceOf(user);

        uint factor = cummulativeReserveFactor[collectionNonce]-cummulativeReserveFactor[userToLastUpdateNonce[user]];
        uint revenueWithTenth = (userProtocolTokenBalance * factor) / (10**23);
        uint remainder = revenueWithTenth % 10;
        uint revenue = revenueWithTenth/10;
        if (remainder >= 5) {
            revenue += 1;
        }
        revenueAvailableByUser[user] += revenue;
        userToLastUpdateNonce[user] = collectionNonce;
        return revenueAvailableByUser[user];
    }
    
    function findSwapPool(address token) public returns (address) {
        //This function finds the UniswapV3 pool to perform a swap to WETH
        //Currently commented out all Uniswap integration while on testnets

        //address swapPoolUsed = uniswapPoolCache[token];
        //if (_isContract(swapPoolUsed)) {
        //    return swapPoolUsed;
        //}
        //address UniswapFactory = address(0x1F98431c8aD98523631AE4a59f267346ea31F984);
        //IUniswapV3Factory factory = IUniswapV3Factory(UniswapFactory);
        //address poolToSwap = address(0);
        //address WETH500 = factory.getPool(addressWETH, token, 500);
        //if (_isContract(WETH500)) {
        //    return WETH500;
        //}
        //address WETH3000 = factory.getPool(addressWETH, token, 3000);
        //if (_isContract(WETH3000)) {
        //    return WETH3000;
        //}
        //address WETH10000 = factory.getPool(addressWETH, token, 10000);
        //if (_isContract(WETH10000)) {
        //    return WETH10000;
        //}
        return address(0);
    }

    function transferRevenueAsWETH(address pool, address revenueToken, uint amount) public returns (bool success) {
        //This function delivers the revenue as WETH to the reserve contract
        //If the revenueToken is not WETH and a UniswapV3 pool exists, swap the token for WETH and transfer it to reserve contract
        //This function is internal, only being called within the 'collectProtocolRevenue()' logic to send revenue to the reserve contract
        //pool is the address of the pool from which the revenues are being transfered from, msg.sender would always be the reserve contract

        //pool that is origin of revenue has already approved the transfer executedwithin this reserve contract
        //transfer from origin pool to this reserve contract
        bool transferRevenueSuccess = IERC20(revenueToken).transferFrom(pool, address(this), amount);
        require(transferRevenueSuccess == true, "transferFrom failed!");

        if (revenueToken != addressWETH) {
            //Call the findSwapPool() function to get the swap pool
            address UniswapPool = findSwapPool(revenueToken);
            if (UniswapPool != address(0)) {
                IUniswapV3Pool uniswapV3Pool = IUniswapV3Pool(UniswapPool);
                //approve the uniswap pool from the reserve contract to perform the transfer/swap
                IERC20(revenueToken).approve(UniswapPool, amount);

                bool zeroForOne = true;
                if (uniswapV3Pool.token0() == addressWETH) {
                    zeroForOne = false;
                }

                uint data = 0;
                //perform the swap, transfering the WETH being swapped for to this reserve contract
                uniswapV3Pool.swap(
                    address(this),
                    zeroForOne,
                    int256(amount),
                    0,
                    abi.encodePacked(data)
                );
            }
        }

        return true;
    }

    function updateProtocolRevenueFactor(uint256 amount) external {
        //This function updates the current withdraw intervals reserve factor
        require(amount > 0, "Amount must be greater than zero");

        //Increment the nonce for total number of protocol revenue collections across all pools
        uint priorNonce = collectionNonce;
        collectionNonce += 1;

        //Calculate the reserve factor from this collection
        //Scale the amount by 10**24 to account for decimals

        uint supply = IERC20(protocolToken).totalSupply();
        uint256 scaledAmount = amount * (10**24);
        cummulativeReserveFactor[collectionNonce] = (scaledAmount / supply) + cummulativeReserveFactor[collectionNonce - 1];
    }

    function withdrawRevenues(uint256 amount, address revenueToken) public {
        //This function is to be called by protocol token holders when they want to withdraw their accumulated revenues from the protocol
        //address revenueToken is FOR TESTING PURPOSES. SHOULD BE WETH IN PRODUCTION
        
        require(amount > 0, "Amount must be greater than zero");
        acctProtocolRevenueCalculation(msg.sender);

        //TESTING TAKES BALANCE OF INPUT REV TOKEN, IN PRODUCTION SHOULD BE WETH
        require(IERC20(revenueToken).balanceOf(address(this)) >= amount, "Insufficient balance1");
        
        require(revenueAvailableByUser[msg.sender] >= amount, "Insufficient balance2");

        //TESTING TRANSFERS INPUT REV TOKEN, IN PRODUCTION THIS IS WETH
        revenueAvailableByUser[msg.sender] -= amount;
        bool revenueWithdrawSuccess = IERC20(revenueToken).transfer(msg.sender, amount);
        require(revenueWithdrawSuccess == true, "Transfer failed!");
        
        emit TokensWithdrawn(revenueToken, msg.sender, amount);

    }

    function _isContract(address _a) public returns (bool) {
        uint size;
        assembly {
            size := extcodesize(_a)
        }
        return size > 0;
    }
}
