pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SubgraphManager is Ownable {
    mapping(address => bool) public approvedSubgraphs;
    mapping(address => uint256) public subgraphUpdatedTimestamp;

    event ApprovalChanged(bool isApproved);

    function updateSubgraphStatus(address subgraphContract, bool approved) public onlyOwner {
        // function to be called after voting on a subgraph
        approvedSubgraphs[subgraphContract] = approved;
        emit ApprovalChanged(approved);
    }

    function disableSubgraph(address subgraphContract) public onlyOwner {
        // function to be called after a subgraph has been updated
        // in the parent contract, the function that calls this function will make a DECO query to the Graph meta subgraph and pull the lastUpdated data, compare to how the mapping of subgraph address to lastUpdated timestamp 
    }

    function retrieveSubgraphStatus(address subgraphContract) public view returns (bool) {
        return approvedSubgraphs[subgraphContract];
    }
}