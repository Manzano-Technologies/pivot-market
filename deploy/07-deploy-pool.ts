import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers, network, upgrades } from "hardhat";
import { MIN_DELAY, PoolContractDeployed_SIGNATURE, TestTokenDeployed_SIGNATURE, VOTING_DELAY, VOTING_PERIOD, developmentChains } from "../hardhat-helper-config";
import * as fs from "fs"
import BigNumber from "bignumber.js";


import { moveBlocks } from "../utils/move-blocks";
import { moveTime } from "../utils/move-time";

const deployTestPoolContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const { get, deploy } = deployments;
    const { deployer } = await getNamedAccounts();


    const determinationContract = await deploy("DeterminationContract", {
        from: deployer,
        args: [],
        log: true,

    });
    fs.writeFileSync("determine.txt", determinationContract.address)


    const governanceToken = await ethers.getContract("GovernanceToken");
    // // const reserveContractAddress = "0x415E89ed57A5ba7cBf6311b41530E156C1659ea4"
    const reserveContractAddress = await governanceToken.reserveContract()
    const reserveContract = await ethers.getContractAt("ProtocolReserveManager", reserveContractAddress);
    const iface = new ethers.utils.Interface([PoolContractDeployed_SIGNATURE, TestTokenDeployed_SIGNATURE])

    // // // // SEQUENCE FOR DEPLOYING THE TEST REVENUE TOKEN FOR THIS POOL


    const testTokenDeploy = await deploy("TestToken", {
        from: deployer,
        args: [],
        log: true,

    });

    // // // // // const testTokenContractDecoded = iface.decodeEventLog("TestTokenDeployed", testTokenTx.events[1].data, testTokenTx.events[1].topics);
    const testTokenAddress = testTokenDeploy.address;
    fs.writeFileSync("testtoken.txt", testTokenAddress)
    // // // // // const poolCont = await ethers.getContractAt("PoolManager", "0x49fe77C764911543832A79eD8a45AFB16a41BCBB");
    // // // // const testTokenAddress = await poolCont.depositTokenAddress()
    const testToken = await ethers.getContractAt("TestToken", testTokenAddress);

    const subgraphAddresses = (JSON.parse(fs.readFileSync('addr.txt', { encoding: 'utf8', flag: 'r' })))
    const subgraphA = subgraphAddresses.subgraphA;
    const tx = await testToken.approve(reserveContractAddress, BigInt(1000000000))
    // console.log(await tx.wait())

    const title = ethers.utils.formatBytes32String("TEST POOL AAA")
    const poolId = ethers.utils.formatBytes32String("123")


    // const subgraphB = subgraphAddresses.subgraphB
    const poolContractDeployTx = await reserveContract.deployPoolContract(testTokenAddress, ethers.utils.formatBytes32String("POOLNAME"), BigInt(1000000000), subgraphA, ethers.utils.formatBytes32String('SUB A'))
    const poolContractTx = await poolContractDeployTx.wait()
    // const poolContractTx = await poolContractDeployTx.wait();
    // // console.log('TEST TOKEN SUPPLY: ', (await testToken.totalSupply()).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())

    const eventObject = poolContractTx.events.find(x => x.event === "PoolContractDeployed");

    // // //Rather than hardcoded index should use find method to get the event with the event fragment specified
    const poolContractDecoded = iface.decodeEventLog("PoolContractDeployed", eventObject.data, eventObject.topics);

    const poolContractAddress = poolContractDecoded[0];
    fs.writeFileSync("poolContract.txt", poolContractAddress)
    // console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())

    // console.log("Pool: ", poolContractAddress)
    // console.log("Reserve: ", reserveContractAddress)

    const poolContract = await ethers.getContractAt("PoolManager", poolContractAddress)

    await poolContract.addDetermination(determinationContract.address)

    // console.log(reserveContractAddress, 'APRO', 'GRAU', await reserveContract.displayPoolList())

    const subgraphAContract = await ethers.getContractAt("SubgraphManager", subgraphA);

    await poolContract.pivotDeposit()
    console.log(await subgraphAContract.currentPositionBalance(poolContractAddress))
    await subgraphAContract.setSubgraphQueryURI(ethers.utils.formatBytes32String("https://www.graphtest.zyx"))
    // const subgraphBContract = await ethers.getContractAt("SubgraphManager", subgraphB);


    const pTokenAddress = await poolContract.pTokenAddress();
    const pTokenContract = await ethers.getContractAt("PoolToken", pTokenAddress)
    const pTokenBalance = await pTokenContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    await pTokenContract.approve(poolContractAddress, pTokenBalance)
    // await testToken.approve(subgraphA, BigInt(1000000000))

    console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    // const depo = await poolContract.userWithdraw(1);
    console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    // const depo = await poolContract.determinationContractAddress()



}

export default deployTestPoolContract;