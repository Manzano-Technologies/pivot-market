import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import * as fs from "fs"

import { PoolContractDeployed_SIGNATURE, ReserveContractDeployed_SIGNATURE } from "../hardhat-helper-config";

const deployReserveManagerContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const reserveAddress = (fs.readFileSync('reserve.txt', { encoding: 'utf8', flag: 'r' }))

    const SubgraphA = await deploy("SubgraphManager", {
        from: deployer,
        args: [ethers.utils.formatBytes32String('SUB A'), reserveAddress],
        log: true,
    });

    // const SubgraphB = await deploy("SubgraphManager", {
    //     from: deployer,
    //     args: [ethers.utils.formatBytes32String('SUB B')],
    //     log: true,
    // });

    // console.log('SUBGRAPHS DEPLOYED', SubgraphA.address, SubgraphB.address)
    // // // 
    const json = {
        subgraphA: SubgraphA.address,
        // subgraphB: SubgraphB.address
    }

    fs.writeFileSync("addr.txt", JSON.stringify(json))

    const reserveContract = await ethers.getContractAt("ProtocolReserveManager", reserveAddress);
    await reserveContract.addSubgraph(reserveAddress)

}

export default deployReserveManagerContract;