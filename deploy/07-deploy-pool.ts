import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers, network } from "hardhat";
import { MIN_DELAY, PoolContractDeployed_SIGNATURE, TestTokenDeployed_SIGNATURE, VOTING_DELAY, VOTING_PERIOD, developmentChains } from "../hardhat-helper-config";
import { propose } from "../scripts/propose";
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

    const governanceToken = await ethers.getContract("GovernanceToken");
    const reserveContractAddress = await governanceToken.reserveContract();

    const reserveContract = await ethers.getContractAt("ProtocolReserveManager", reserveContractAddress);
    const iface = new ethers.utils.Interface([PoolContractDeployed_SIGNATURE, TestTokenDeployed_SIGNATURE])

    // SEQUENCE FOR DEPLOYING THE TEST REVENUE TOKEN FOR THIS POOL


    const deployTestTokenTx = await reserveContract.deployTestToken()
    const testTokenTx = await deployTestTokenTx.wait();

    const testTokenContractDecoded = iface.decodeEventLog("TestTokenDeployed", testTokenTx.events[1].data, testTokenTx.events[1].topics);
    const testTokenAddress = testTokenContractDecoded[0];
    const testToken = await ethers.getContractAt("TestToken", testTokenAddress);
    console.log('TEST TOKEN SUPPLY: ', (await testToken.totalSupply()).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    await testToken.approve(reserveContractAddress, BigInt(2000000000000000000000))
    const subgraphAddresses = (JSON.parse(fs.readFileSync('addr.txt', { encoding: 'utf8', flag: 'r' })))
    const subgraphA = subgraphAddresses.subgraphA;
    const subgraphB = subgraphAddresses.subgraphB
    const poolContractDeployTx = await reserveContract.deployPoolContract(testTokenAddress, "0x7a65726700000000000000000000000000000000000000000000000000000000", BigInt(2000000000000000000000), subgraphA, ethers.utils.formatBytes32String('SUB A'))
    const poolContractTx = await poolContractDeployTx.wait();
    console.log('TEST TOKEN SUPPLY: ', (await testToken.totalSupply()).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())

    const eventObject = poolContractTx.events.find(x => x.event === "PoolContractDeployed");

    //Rather than hardcoded index should use find method to get the event with the event fragment specified
    const poolContractDecoded = iface.decodeEventLog("PoolContractDeployed", eventObject.data, eventObject.topics);

    const poolContractAddress = poolContractDecoded[0];
    console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())

    const poolContract = await ethers.getContractAt("PoolManager", poolContractAddress);
    console.log(determinationContract.address)
    await poolContract.addDetermination(determinationContract.address)

    const subgraphAContract = await ethers.getContractAt("SubgraphManager", subgraphA);
    const subgraphBContract = await ethers.getContractAt("SubgraphManager", subgraphB);

    await poolContract.pivotDeposit()

    const poolBalanceInSubgraph = await subgraphAContract.poolBalance(poolContractAddress);

    console.log('ZOINJKA', poolBalanceInSubgraph.toString(), (await testToken.balanceOf(subgraphA)).toString())

    console.log(await poolContract.approvedSubgraphPivotTarget())

    await poolContract.determinePivot(ethers.utils.formatBytes32String('SUB B'), subgraphB)
    const withd = await poolContract.pivotWithdraw()
    await withd.wait()

    const depo = await poolContract.pivotDeposit();

    //BALANCES ON SUBGRAPH A DONT SEEM TO CHANGE AFTER WITHDRAW

    console.log((await poolContract.approvedSubgraphPivotTarget()).toString(), (await subgraphBContract.poolBalance(poolContractAddress)).toString(), (await testToken.balanceOf(subgraphB)).toString())

    console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString(), (await testToken.balanceOf(subgraphA)).toString(), (await testToken.balanceOf(subgraphB)).toString())

    await poolContract.simulateInterestGained(BigInt(3000000000000000000000))

    console.log((await poolContract.approvedSubgraphPivotTarget()).toString(), (await subgraphBContract.poolBalance(poolContractAddress)).toString(), (await testToken.balanceOf(subgraphB)).toString())

    // CALL THE POOL INTERACTION TO TRIGGER THE REVENUE DISTRIBUTION FUNCTIONALITY 

    const pTokenContract = await ethers.getContractAt("PoolToken", "0x4339F9D3B368e71bDa5aede52FCf5e8F9DC6C605")
    // console.log("0x4339F9D3B368e71bDa5aede52FCf5e8F9DC6C605 - pToken.totalSupply() after init deposit", (await pTokenContract.totalSupply()).toString())


    // console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    // await testToken.approve(poolContractAddress, BigInt(1000000000000000000000))
    // await poolContract.userDeposit(BigInt(1000000000000000000000))

    // console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    // console.log("0x4339F9D3B368e71bDa5aede52FCf5e8F9DC6C605 - pToken.totalSupply() after simulated deposit", (await pTokenContract.totalSupply()).toString())

    // console.log('DEPOSITED: SHOULD BE 3000....', (await poolContract.deposited()).toString(), (await poolContract.userToDeposits("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    // await poolContract.simulateInterestGained()
    // console.log('INTEREST GAINED>>>>>>>>>')
    // console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    // console.log("0x4339F9D3B368e71bDa5aede52FCf5e8F9DC6C605 - pToken.totalSupply() after simulated deposit", (await pTokenContract.totalSupply()).toString())

    // const ta = await poolContract.simulateUserDeposit(BigInt(4000000000000000000000))
    // await ta.wait()
    // console.log('DEPOSITED: SHOULD BE 3000....', (await poolContract.deposited()).toString(), (await poolContract.userToDeposits("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())

    // console.log('SIMULATED POSITION BAL', (await poolContract.simulatedPositionBalance()).toString())
    // console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    // console.log("USER DEPOS", (await poolContract.userToDeposits("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString(), (await poolContract.userToDeposits("0x30CF84E121F2105e638746dCcCffebCE65B18F7C")).toString())
    // console.log("pToken.totalSupply() after depo from user 2", (await pTokenContract.totalSupply()).toString(), (await pTokenContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString(), (await pTokenContract.balanceOf("0x30CF84E121F2105e638746dCcCffebCE65B18F7C")).toString())
    console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString(), (await testToken.balanceOf(subgraphA)).toString(), (await testToken.balanceOf(subgraphB)).toString())

    await pTokenContract.approve(poolContractAddress, BigInt(4000000000000000000000))
    const poolInteraction1 = await poolContract.userWithdraw(BigInt(4000000000000000000000));
    const pi1 = await poolInteraction1.wait()

    // const poolInteraction2 = await poolContract.userWithdraw(BigInt(500000000000000000000));
    // const pi2 = await poolInteraction2.wait()
    // profit is 1000.... 100 to protocol, 100 to bonusUser (hardcode to addr in contract for testing), 80% distributed to pool depositors (in this case only user)
    // testtoken total supply still 4000


    console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString(), (await testToken.balanceOf(subgraphA)).toString(), (await testToken.balanceOf(subgraphB)).toString(), (await testToken.balanceOf("0x30CF84E121F2105e638746dCcCffebCE65B18F7C")).toString())


    console.log("pToken.totalSupply() after withdraw 1", (await pTokenContract.totalSupply()).toString(), (await pTokenContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())

    // await pTokenContract.approve(poolContractAddress, BigInt(250000000000000000000))

    // const poolInteraction2 = await poolContract.userWithdraw(BigInt(250000000000000000000));
    // const pi2 = await poolInteraction2.wait()
    // console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())

    // console.log("0x4339F9D3B368e71bDa5aede52FCf5e8F9DC6C605 - pToken.totalSupply() after withdraw 2", (await pTokenContract.totalSupply()).toString(), (await pTokenContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    console.log("GOV TOKEN BALANCES: ", (await governanceToken.balanceOf(reserveContractAddress)).toString(), (await governanceToken.balanceOf(poolContractAddress)).toString(), (await governanceToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString(), (await governanceToken.balanceOf("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")).toString())
    const govTokTrans = await governanceToken.transfer("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", BigInt(2000000000000000000000))

    await poolContract.simulateInterestGained(BigInt(2000000000000000000000));

    await pTokenContract.approve(poolContractAddress, BigInt(1500000000000000000000))
    const poolInteraction2 = await poolContract.userWithdraw(BigInt(1500000000000000000000));
    const pi2 = await poolInteraction2.wait()

    await testToken.approve(subgraphB, BigInt(1000000000000000000000))
    await poolContract.userDeposit(BigInt(1000000000000000000000))

    console.log((await subgraphBContract.currentPositionBalance(poolContractAddress)).toString())
    await poolContract.determinePivot(ethers.utils.formatBytes32String('SUB A'), subgraphA)
    const withdr = await poolContract.pivotWithdraw()
    await withdr.wait()


    console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString(), (await testToken.balanceOf(subgraphA)).toString(), (await testToken.balanceOf(subgraphB)).toString(), (await testToken.balanceOf("0x30CF84E121F2105e638746dCcCffebCE65B18F7C")).toString())
    console.log((await poolContract.deposited()).toString(), (await poolContract.protocolFee()).toString(), (await poolContract.bonusPayout()).toString(), (await testToken.balanceOf(poolContractAddress)).toString())
    const depos = await poolContract.pivotDeposit();


    // await pTokenContract.approve(poolContractAddress, BigInt(1500000000000000000000))
    // const poolInteraction3 = await poolContract.userWithdraw(BigInt(1500000000000000000000));
    // const pi3 = await poolInteraction3.wait()

    // console.log("pToken.totalSupply() after withdraw 1", (await pTokenContract.totalSupply()).toString(), (await pTokenContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())



    // console.log("GOV TOKEN BALANCES: ", (await governanceToken.balanceOf(reserveContractAddress)).toString(), (await governanceToken.balanceOf(poolContractAddress)).toString(), (await governanceToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString(), (await governanceToken.balanceOf("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")).toString())
    // await pTokenContract.approve(poolContractAddress, BigInt(250000000000000000000))

    // const poolInteraction3 = await poolContract.userWithdraw(BigInt(250000000000000000000));
    // const pi3 = await poolInteraction3.wait()

    // console.log('CHECK EVENTS DATA', pi3.events[0].args[0].toString(), pi2.events[0].args[0].toString(), pi1.events[0].args[0].toString(), 'OSU', (await pTokenContract.totalSupply()).toString(), (await pTokenContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString(), (await pTokenContract.balanceOf(poolContractAddress)).toString())

    // console.log("TEST TOKEN BALANCES: ", (await testToken.totalSupply()).toString(), " (SUPPLY) //////// ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())

    // await reserveContract.acctProtocolRevenueCalculation("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    // await reserveContract.acctProtocolRevenueCalculation("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")

    // console.log("REVENUE AVAILABLE FOR 0x...2266: ", (await reserveContract.revenueAvailableByUser("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    // console.log("REVENUE AVAILABLE FOR 0x...a6e0: ", (await reserveContract.revenueAvailableByUser("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")).toString())

    console.log("RESERVE FACTOR 0,1,2,3: ", (await reserveContract.cummulativeReserveFactor(0)).toString(), (await reserveContract.cummulativeReserveFactor(1)).toString(), (await reserveContract.cummulativeReserveFactor(2)).toString(), (await reserveContract.cummulativeReserveFactor(3)).toString())

    // console.log("REVENUE AVAILABLE FOR 0x...2266: ", (await reserveContract.revenueAvailableByUser("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())
    // console.log("TEST TOKEN BALANCES: ", (await testToken.balanceOf(reserveContractAddress)).toString(), (await testToken.balanceOf(poolContractAddress)).toString(), (await testToken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toString())

    // console.log('POOL OWNER:', await poolContract.owner())

    // //Begin proposal sequence

    // const governor = await get("GovernorContract");
    // const governorContract = await ethers.getContractAt("GovernorContract", governor.address);

    // const encodedFunctionCall = poolContract.interface.encodeFunctionData("disapprovePool", [])
    // console.log(`Proposing disapprovePool on ${poolContractAddress}`)
    // console.log(`Proposal Description:\n`)
    // const proposeTx = await governorContract.propose(
    //     [poolContractAddress],
    //     [0],
    //     [encodedFunctionCall],
    //     ""
    // )
    // // If working on a development chain, we will push forward till we get to the voting period.
    // if (developmentChains.includes(network.name)) {
    //     await moveBlocks(VOTING_DELAY + 1)
    // }
    // const proposeReceipt = await proposeTx.wait(1)
    // const proposalId = proposeReceipt.events[0].args.proposalId
    // console.log(`Proposed with proposal ID:\n  ${proposalId}`)

    // const proposalState = await governorContract.state(proposalId)

    // // the Proposal State is an enum data type, defined in the IGovernor contract.
    // // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    // console.log(`Current Proposal State: ${proposalState}`)
    // console.log(await poolContract.poolApproved())


    // //begin voting sequence

    // //Voting from signer account
    // const voteTx = await governorContract.castVoteWithReason(proposalId, 1, "MY REASON")
    // const voteTxReceipt = await voteTx.wait(1)
    // console.log(voteTxReceipt.events[0].args.reason)
    // const proposalState2 = await governorContract.state(proposalId)
    // console.log(`Current Proposal State: ${proposalState2}`)


    // //Move to end of voting
    // if (developmentChains.includes(network.name)) {
    //     await moveBlocks(VOTING_PERIOD + 1)
    // }

    // //Now that voting has ended, here is the final result
    // const proposalState3 = await governorContract.state(proposalId)
    // console.log(`Current Proposal State: ${proposalState3}`)

    // //Queue the function call to be executed upon voting success
    // const queueTx = await governorContract.queue([poolContractAddress], [0], [encodedFunctionCall], ethers.utils.keccak256(ethers.utils.toUtf8Bytes("")))
    // await queueTx.wait(1)

    // if (developmentChains.includes(network.name)) {
    //     await moveTime(MIN_DELAY + 1)
    //     await moveBlocks(1)
    // }

    // console.log("Executing...")
    // // this will fail on a testnet because you need to wait for the MIN_DELAY!
    // const executeTx = await governorContract.execute(
    //     [poolContractAddress],
    //     [0],
    //     [encodedFunctionCall],
    //     ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
    // )
    // await executeTx.wait(1)
    // await moveBlocks(1)

    // //Check if poolApproved is false, as voted on
    // console.log(await poolContract.poolApproved())

}

export default deployTestPoolContract;