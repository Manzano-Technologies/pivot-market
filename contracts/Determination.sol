pragma solidity ^0.8.8;
pragma experimental ABIEncoderV2;


contract DeterminationContract {

    constructor() {

    }

    function calculation(
        uint[] calldata targetSubgraphDataset,
        uint targetDatapointCount,
        uint[] calldata currentSubgraphDataset,
        uint currentDatapointCount
        ) external view returns (bool determination) {
        uint targetSum = 0;
        for (uint i = 0; i < targetDatapointCount; i++) {
            targetSum += targetSubgraphDataset[i];
        }
        uint targetAvg = targetSum/targetDatapointCount;
        
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