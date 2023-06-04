pragma solidity ^0.8.8;
pragma experimental ABIEncoderV2;

/// @title DeterminationContract
/// @author Michael Manzano
/// @notice This contract is a template/example of logic at determines whether or not a pool should pivot its target
/// @dev All function calls are views, the determination contract logic calculates and returns booleans as to whether or not to pivot a pool's deposits
contract DeterminationContract {

    constructor() {

    }

    /// @dev The calculation function intakes arrays of data and calculates whether the target subgraph is a better investment
    /// @param targetSubgraphDataset contains data points from the subgraph that is potentially going to be switched to
    /// @param currentSubgraphDataset contains updated data points from the subgraph that is currently active
    function calculation(uint[] calldata targetSubgraphDataset, uint[] calldata currentSubgraphDataset) external view returns (bool determination) {
        uint targetDatapointCount = targetSubgraphDataset.length;
        uint targetSum = 0;
        for (uint i = 0; i < targetDatapointCount; i++) {
            targetSum += targetSubgraphDataset[i];
        }
        uint targetAvg = targetSum/targetDatapointCount;
        uint currentDatapointCount = currentSubgraphDataset.length;
        uint currentSum = 0;
        for (uint i = 0; i < currentDatapointCount; i++) {
            currentSum += currentSubgraphDataset[i];
        }
        uint currentAvg = currentSum/currentDatapointCount;

        if (targetAvg > currentAvg) {
            return true;
        }
        return false;
    }
}