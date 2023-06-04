import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers, upgrades } from "hardhat";
import { PoolContractDeployed_SIGNATURE, ReserveContractDeployed_SIGNATURE } from "../hardhat-helper-config";

const deployReserveManagerContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const { get } = deployments;

    const governanceToken = await ethers.getContract("GovernanceToken");
    const iface = new ethers.utils.Interface([ReserveContractDeployed_SIGNATURE, PoolContractDeployed_SIGNATURE])

    const governor = await get("GovernorContract");

    const Reserve = await ethers.getContractFactory("ProtocolReserveManager");
    const reserve = await upgrades.deployProxy(Reserve, [governanceToken.address, governor.address], { initializer: "initialize" })
    console.log('GAHAHAHHA', reserve.address, await reserve.deployed())
    //SETRESERVECONTRACT SHOULD PASS IN THE PROXY CONTRACT ADDRESS
    const reserveContractDeployTx = await governanceToken.setReserveContract(reserve.address);
    const reserveContract = await reserveContractDeployTx.wait();

}

export default deployReserveManagerContract;