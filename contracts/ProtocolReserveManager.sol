pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./PoolManager.sol";

interface IGovernorContract {
    function timelock() external view returns (address);
}

/// @title ProtocolReserveManager
/// @author Michael Manzano
/// @notice This contract is for handling protocol level revenues and managing pools
contract ProtocolReserveManager {

    address originalDeployer;

    address governorContract;

    address public protocolToken;

    address constant addressWETH = address(0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f);
//    address addressWETH = address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    uint256 collectionNonce;

    mapping(address => uint256) public revenueAvailableByUser;

    mapping(address => uint256) public userToLastUpdateNonce;

    mapping(uint256 => uint256) public cummulativeReserveFactor;

    mapping(address => address) public uniswapPoolCache;

    mapping(bytes32 => address) public titleToPool;

    address [] poolList;

    address [] subgraphList;

    event TokensWithdrawn(address indexed token, address indexed recipient, uint256 amount);

    event PoolContractDeployed(address contractAddress);

    /// @dev Initializes the contract with the provided token and governor address.
    /// @dev Replaces the constructor for upgradeable contracts
    /// @param tokenAddress The address of the token to be used in the protocol.
    /// @param governorAddress The address of the governor contract.
    function initialize(address tokenAddress, address governorAddress) external {
        originalDeployer = msg.sender;
        cummulativeReserveFactor[0] = 0;
        require(tokenAddress != address(0), "Cannot be set to a ZERO Address");
        protocolToken = tokenAddress;
        require(governorAddress != address(0), "Cannot be set to a ZERO Address");
        governorContract = governorAddress;
    }

    /// @dev Deploys a new PoolManager contract.
    /// @param depositToken The address of the deposit token for the pool.
    /// @param title The title of the pool.
    /// @param initialDepositAmount The initial deposit amount for the pool.
    /// @param subgraphPivotTarget The target subgraph for the pool.
    /// @param poolIdPivotTarget The target pool ID for the pool.
    function deployPoolContract(
        address depositToken,
        bytes32 title,
        uint256 initialDepositAmount,
        address subgraphPivotTarget,
        bytes32 poolIdPivotTarget
    ) public {        
        PoolManager poolManagerContract = new PoolManager(msg.sender, depositToken, title, address(this), subgraphPivotTarget, poolIdPivotTarget);  // Deploy PoolManager
        address poolManagerAddress = address(poolManagerContract);
        require(poolManagerAddress != address(0), "Failed To deploy");
        titleToPool[title] = poolManagerAddress;
        TestToken testToken = TestToken(depositToken);
        bool deployTransferSuccess = IERC20(depositToken).transferFrom(msg.sender, poolManagerAddress, initialDepositAmount);
        require(deployTransferSuccess == true, "transferFrom failed!");
        poolManagerContract.initializePoolTokens(msg.sender, initialDepositAmount);
        address timelock = IGovernorContract(governorContract).timelock();
        poolManagerContract.transferOwnership(timelock);
        poolList.push(poolManagerAddress);
        emit PoolContractDeployed(poolManagerAddress);
    }

    /// @dev For the time being, this function can only be called by the user who deployed the reserve contract
    /// @param subgraphAddress The address of the subgraph contract after deployment
    function addSubgraph(address subgraphAddress) external {
        require(msg.sender == originalDeployer, "Only the original deployer of the reserve contract may add subgraphs to the reserve");
        subgraphList.push(subgraphAddress);
    }

    /// @notice Function to read all pool addresses
    /// @return Array of addresses stored in memory
    function displayPoolList() view external returns (address [] memory) {
        return poolList;
    }

    /// @notice Function to read all subgraph contract addresses
    /// @return Array of addresses stored in memory
    function displaySubgraphList() view external returns (address [] memory) {
        return subgraphList;
    }

    /// @dev Calculates the protocol-level revenues accumulated for the sender since the last calculation.
    /// @dev Function takes the most recently recorded cummulativeReserveFactor and subtracts the reserve factor of the last time the user revenue was updated. 
    /// @param user The address of the user/protocol token holder.
    /// @return availableRevenue The updated amount of protocol revenues available for the user.
    function protocolRevenueCalculation(address user) public returns (uint256 availableRevenue) {
        revenueAvailableByUser[user] = viewProtocolLevelRevenue(user);
        userToLastUpdateNonce[user] = collectionNonce;
        return revenueAvailableByUser[user];
    }

    /// @dev Calculates the protocol-level revenues accumulated for the sender since the last calculation.
    /// @dev Function takes the most recently recorded cummulativeReserveFactor and subtracts the reserve factor of the last time the user revenue was updated. 
    /// @dev This function is view, does not change state. Useful for viewing an user's current revenues without needing to update the variables
    /// @param user The address of the user/protocol token holder.
    /// @return availableRevenue The amount of protocol revenues available for the user.
    function viewProtocolLevelRevenue(address user) public view returns (uint256 availableRevenue) {
        uint256 userProtocolTokenBalance = IERC20(protocolToken).balanceOf(user);
        uint factor = cummulativeReserveFactor[collectionNonce]-cummulativeReserveFactor[userToLastUpdateNonce[user]];
        uint revenueWithTenth = (userProtocolTokenBalance * factor) / (10**23);
        uint remainder = revenueWithTenth % 10;
        uint revenue = revenueWithTenth/10;
        if (remainder >= 5) {
            revenue += 1;
        }
        revenue += revenueAvailableByUser[user];
        return revenue;
    }

    /// @dev based on the token provided, find the address of the Uniswap liquidity pool
    /// @param token The address of the token to find the swap pool
    /// @return swapPool The liquidity pool address for the token
    function findSwapPool(address token) public returns (address swapPool) {
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

    /// @dev This function transfers the revenue to the reserve contract
    /// @dev If the revenueToken is not WETH and a UniswapV3 pool exists, swap the token for WETH and transfer it to reserve contract
    /// @param revenueToken the address of the token that interest was gained from
    /// @param amount the total amount of revenue to be paid out
    function transferRevenueAsWETH(address revenueToken, uint amount) public returns (bool success) {
        bool transferRevenueSuccess = IERC20(revenueToken).transferFrom(msg.sender, address(this), amount);
        require(transferRevenueSuccess == true, "transferFrom failed!");
        if (revenueToken != addressWETH) {
            address UniswapPool = findSwapPool(revenueToken);
            if (UniswapPool != address(0)) {
                IUniswapV3Pool uniswapV3Pool = IUniswapV3Pool(UniswapPool);
                IERC20(revenueToken).approve(UniswapPool, amount);
                bool zeroForOne = true;
                if (uniswapV3Pool.token0() == addressWETH) {
                    zeroForOne = false;
                }

                uint data = 0;
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

    /// @dev Increment the nonce for total number of protocol revenue collections across all pools and calculate the reserve factor from this collection
    /// @dev Scale the amount by 10**24 to account for decimals
    /// @param amount protocol fee amount to determine the factor
    function updateProtocolRevenueFactor(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        uint priorNonce = collectionNonce;
        collectionNonce += 1;
        uint supply = IERC20(protocolToken).totalSupply();
        uint256 scaledAmount = amount * (10**24);
        cummulativeReserveFactor[collectionNonce] = (scaledAmount / supply) + cummulativeReserveFactor[collectionNonce - 1];
    }

    /// @dev This function is to be called by protocol token holders when they want to withdraw their accumulated revenues from the protocol        
    /// @param amount the total amount of revenue to be paid out
    /// @param revenueToken the address of the token that interest was gained from
    function withdrawRevenues(uint256 amount, address revenueToken) public {
        require(amount > 0, "Amount must be greater than zero");
        protocolRevenueCalculation(msg.sender);
        require(IERC20(revenueToken).balanceOf(address(this)) >= amount, "Insufficient balance1");
        require(revenueAvailableByUser[msg.sender] >= amount, "Insufficient balance2");
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
