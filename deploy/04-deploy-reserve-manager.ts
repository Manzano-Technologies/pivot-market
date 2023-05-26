import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { PoolContractDeployed_SIGNATURE, ReserveContractDeployed_SIGNATURE } from "../hardhat-helper-config";

const deployReserveManagerContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const { get } = deployments;

    const governanceToken = await ethers.getContract("GovernanceToken");
    const iface = new ethers.utils.Interface([ReserveContractDeployed_SIGNATURE, PoolContractDeployed_SIGNATURE])

    const governor = await get("GovernorContract");

    const reserveContractDeployTx = await governanceToken.deployReserveContract(governor.address);
    const reserveContract = await reserveContractDeployTx.wait();
    const reserveContractLogDecode = iface.decodeEventLog("ReserveContractDeployed", reserveContract.events[1].data, reserveContract.events[1].topics);

    const reserveContractAddress = reserveContractLogDecode[0];
    console.log(reserveContractAddress, " RESERVE CONTRACT ADDRESS");

}

export default deployReserveManagerContract;