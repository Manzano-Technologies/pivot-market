/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface PoolManagerInterface extends utils.Interface {
  contractName: "PoolManager";
  functions: {
    "addDetermination(address)": FunctionFragment;
    "approvePool()": FunctionFragment;
    "approvedSubgraphPivotTarget()": FunctionFragment;
    "bonusPayout()": FunctionFragment;
    "calculatePTokenBurn(uint256)": FunctionFragment;
    "currentDepositHoldingAddress()": FunctionFragment;
    "currentTargetSubgraphAddress()": FunctionFragment;
    "depositTokenAddress()": FunctionFragment;
    "deposited()": FunctionFragment;
    "depositedUserCount()": FunctionFragment;
    "despositedRecordedBlock()": FunctionFragment;
    "determinationContractAddress()": FunctionFragment;
    "determinePivot(bytes32,address)": FunctionFragment;
    "disapprovePool()": FunctionFragment;
    "getSubgraphTimeseriesDataPoint(address,uint256)": FunctionFragment;
    "initializePoolTokens(address,uint256)": FunctionFragment;
    "latestSubgraphTimeseries(address,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "pTokenAddress()": FunctionFragment;
    "percent(uint256,uint256,uint256)": FunctionFragment;
    "pivotDeposit()": FunctionFragment;
    "pivotWithdraw()": FunctionFragment;
    "poolApproved()": FunctionFragment;
    "poolMetaData()": FunctionFragment;
    "poolStatistics()": FunctionFragment;
    "protocolFee()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "reserveContractAddress()": FunctionFragment;
    "setReserveContractAddress(address)": FunctionFragment;
    "setSubgraphTimeseriesDataPoint(address,uint256,bytes32)": FunctionFragment;
    "simulateInterestGained(uint256)": FunctionFragment;
    "title()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "userDeposit(uint256)": FunctionFragment;
    "userToDeposits(address)": FunctionFragment;
    "userWithdraw(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addDetermination",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "approvePool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "approvedSubgraphPivotTarget",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "bonusPayout",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculatePTokenBurn",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "currentDepositHoldingAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "currentTargetSubgraphAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "depositTokenAddress",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "deposited", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "depositedUserCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "despositedRecordedBlock",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "determinationContractAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "determinePivot",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "disapprovePool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSubgraphTimeseriesDataPoint",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initializePoolTokens",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "latestSubgraphTimeseries",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pTokenAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "percent",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pivotDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pivotWithdraw",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "poolApproved",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "poolMetaData",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "poolStatistics",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "protocolFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reserveContractAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setReserveContractAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setSubgraphTimeseriesDataPoint",
    values: [string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "simulateInterestGained",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "title", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "userDeposit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "userToDeposits",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "userWithdraw",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "addDetermination",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "approvePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "approvedSubgraphPivotTarget",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bonusPayout",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculatePTokenBurn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentDepositHoldingAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentTargetSubgraphAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositTokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposited", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositedUserCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "despositedRecordedBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "determinationContractAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "determinePivot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disapprovePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSubgraphTimeseriesDataPoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializePoolTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestSubgraphTimeseries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pTokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "percent", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pivotDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pivotWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "poolApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "poolMetaData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "poolStatistics",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "protocolFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reserveContractAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setReserveContractAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSubgraphTimeseriesDataPoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "simulateInterestGained",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "title", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userToDeposits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userWithdraw",
    data: BytesLike
  ): Result;

  events: {
    "ApprovalChanged(bool)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApprovalChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type ApprovalChangedEvent = TypedEvent<
  [boolean],
  { isApproved: boolean }
>;

export type ApprovalChangedEventFilter = TypedEventFilter<ApprovalChangedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PoolManager extends BaseContract {
  contractName: "PoolManager";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PoolManagerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addDetermination(
      contractAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    approvePool(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    approvedSubgraphPivotTarget(overrides?: CallOverrides): Promise<[string]>;

    bonusPayout(overrides?: CallOverrides): Promise<[BigNumber]>;

    calculatePTokenBurn(
      depositTokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    currentDepositHoldingAddress(overrides?: CallOverrides): Promise<[string]>;

    currentTargetSubgraphAddress(overrides?: CallOverrides): Promise<[string]>;

    depositTokenAddress(overrides?: CallOverrides): Promise<[string]>;

    deposited(overrides?: CallOverrides): Promise<[BigNumber]>;

    depositedUserCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    despositedRecordedBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    determinationContractAddress(overrides?: CallOverrides): Promise<[string]>;

    determinePivot(
      pivotTargetPoolId: BytesLike,
      subgraphContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    disapprovePool(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getSubgraphTimeseriesDataPoint(
      subgraphContractAddress: string,
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initializePoolTokens(
      senderAddress: string,
      initialDepositAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    latestSubgraphTimeseries(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pTokenAddress(overrides?: CallOverrides): Promise<[string]>;

    percent(
      numerator: BigNumberish,
      denominator: BigNumberish,
      precision: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { quotient: BigNumber }>;

    pivotDeposit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    pivotWithdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    poolApproved(overrides?: CallOverrides): Promise<[boolean]>;

    poolMetaData(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, BigNumber] & {
        poolTitle: string;
        depositToken: string;
        tokenName: string;
        depositedValue: BigNumber;
        depositedValueInUSD: BigNumber;
      }
    >;

    poolStatistics(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        currentDepositorsCount: BigNumber;
        lifetimeInterestPayout: BigNumber;
        interestGainedOnCurrentCycle: BigNumber;
        blocksSincePivot: BigNumber;
      }
    >;

    protocolFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    reserveContractAddress(overrides?: CallOverrides): Promise<[string]>;

    setReserveContractAddress(
      contractAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSubgraphTimeseriesDataPoint(
      subgraphContractAddress: string,
      index: BigNumberish,
      dataPoint: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    simulateInterestGained(
      amt: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    title(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    userDeposit(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    userToDeposits(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    userWithdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addDetermination(
    contractAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  approvePool(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  approvedSubgraphPivotTarget(overrides?: CallOverrides): Promise<string>;

  bonusPayout(overrides?: CallOverrides): Promise<BigNumber>;

  calculatePTokenBurn(
    depositTokenAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  currentDepositHoldingAddress(overrides?: CallOverrides): Promise<string>;

  currentTargetSubgraphAddress(overrides?: CallOverrides): Promise<string>;

  depositTokenAddress(overrides?: CallOverrides): Promise<string>;

  deposited(overrides?: CallOverrides): Promise<BigNumber>;

  depositedUserCount(overrides?: CallOverrides): Promise<BigNumber>;

  despositedRecordedBlock(overrides?: CallOverrides): Promise<BigNumber>;

  determinationContractAddress(overrides?: CallOverrides): Promise<string>;

  determinePivot(
    pivotTargetPoolId: BytesLike,
    subgraphContract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  disapprovePool(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getSubgraphTimeseriesDataPoint(
    subgraphContractAddress: string,
    index: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initializePoolTokens(
    senderAddress: string,
    initialDepositAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  latestSubgraphTimeseries(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  pTokenAddress(overrides?: CallOverrides): Promise<string>;

  percent(
    numerator: BigNumberish,
    denominator: BigNumberish,
    precision: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  pivotDeposit(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  pivotWithdraw(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  poolApproved(overrides?: CallOverrides): Promise<boolean>;

  poolMetaData(
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, BigNumber, BigNumber] & {
      poolTitle: string;
      depositToken: string;
      tokenName: string;
      depositedValue: BigNumber;
      depositedValueInUSD: BigNumber;
    }
  >;

  poolStatistics(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      currentDepositorsCount: BigNumber;
      lifetimeInterestPayout: BigNumber;
      interestGainedOnCurrentCycle: BigNumber;
      blocksSincePivot: BigNumber;
    }
  >;

  protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  reserveContractAddress(overrides?: CallOverrides): Promise<string>;

  setReserveContractAddress(
    contractAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSubgraphTimeseriesDataPoint(
    subgraphContractAddress: string,
    index: BigNumberish,
    dataPoint: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  simulateInterestGained(
    amt: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  title(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  userDeposit(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  userToDeposits(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  userWithdraw(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addDetermination(
      contractAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    approvePool(overrides?: CallOverrides): Promise<void>;

    approvedSubgraphPivotTarget(overrides?: CallOverrides): Promise<string>;

    bonusPayout(overrides?: CallOverrides): Promise<BigNumber>;

    calculatePTokenBurn(
      depositTokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentDepositHoldingAddress(overrides?: CallOverrides): Promise<string>;

    currentTargetSubgraphAddress(overrides?: CallOverrides): Promise<string>;

    depositTokenAddress(overrides?: CallOverrides): Promise<string>;

    deposited(overrides?: CallOverrides): Promise<BigNumber>;

    depositedUserCount(overrides?: CallOverrides): Promise<BigNumber>;

    despositedRecordedBlock(overrides?: CallOverrides): Promise<BigNumber>;

    determinationContractAddress(overrides?: CallOverrides): Promise<string>;

    determinePivot(
      pivotTargetPoolId: BytesLike,
      subgraphContract: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    disapprovePool(overrides?: CallOverrides): Promise<void>;

    getSubgraphTimeseriesDataPoint(
      subgraphContractAddress: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    initializePoolTokens(
      senderAddress: string,
      initialDepositAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    latestSubgraphTimeseries(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    pTokenAddress(overrides?: CallOverrides): Promise<string>;

    percent(
      numerator: BigNumberish,
      denominator: BigNumberish,
      precision: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pivotDeposit(overrides?: CallOverrides): Promise<boolean>;

    pivotWithdraw(overrides?: CallOverrides): Promise<boolean>;

    poolApproved(overrides?: CallOverrides): Promise<boolean>;

    poolMetaData(
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, BigNumber, BigNumber] & {
        poolTitle: string;
        depositToken: string;
        tokenName: string;
        depositedValue: BigNumber;
        depositedValueInUSD: BigNumber;
      }
    >;

    poolStatistics(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        currentDepositorsCount: BigNumber;
        lifetimeInterestPayout: BigNumber;
        interestGainedOnCurrentCycle: BigNumber;
        blocksSincePivot: BigNumber;
      }
    >;

    protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    reserveContractAddress(overrides?: CallOverrides): Promise<string>;

    setReserveContractAddress(
      contractAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setSubgraphTimeseriesDataPoint(
      subgraphContractAddress: string,
      index: BigNumberish,
      dataPoint: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    simulateInterestGained(
      amt: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    title(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    userDeposit(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    userToDeposits(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    userWithdraw(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ApprovalChanged(bool)"(isApproved?: null): ApprovalChangedEventFilter;
    ApprovalChanged(isApproved?: null): ApprovalChangedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    addDetermination(
      contractAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    approvePool(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    approvedSubgraphPivotTarget(overrides?: CallOverrides): Promise<BigNumber>;

    bonusPayout(overrides?: CallOverrides): Promise<BigNumber>;

    calculatePTokenBurn(
      depositTokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentDepositHoldingAddress(overrides?: CallOverrides): Promise<BigNumber>;

    currentTargetSubgraphAddress(overrides?: CallOverrides): Promise<BigNumber>;

    depositTokenAddress(overrides?: CallOverrides): Promise<BigNumber>;

    deposited(overrides?: CallOverrides): Promise<BigNumber>;

    depositedUserCount(overrides?: CallOverrides): Promise<BigNumber>;

    despositedRecordedBlock(overrides?: CallOverrides): Promise<BigNumber>;

    determinationContractAddress(overrides?: CallOverrides): Promise<BigNumber>;

    determinePivot(
      pivotTargetPoolId: BytesLike,
      subgraphContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    disapprovePool(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getSubgraphTimeseriesDataPoint(
      subgraphContractAddress: string,
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initializePoolTokens(
      senderAddress: string,
      initialDepositAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    latestSubgraphTimeseries(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pTokenAddress(overrides?: CallOverrides): Promise<BigNumber>;

    percent(
      numerator: BigNumberish,
      denominator: BigNumberish,
      precision: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pivotDeposit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    pivotWithdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    poolApproved(overrides?: CallOverrides): Promise<BigNumber>;

    poolMetaData(overrides?: CallOverrides): Promise<BigNumber>;

    poolStatistics(overrides?: CallOverrides): Promise<BigNumber>;

    protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    reserveContractAddress(overrides?: CallOverrides): Promise<BigNumber>;

    setReserveContractAddress(
      contractAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSubgraphTimeseriesDataPoint(
      subgraphContractAddress: string,
      index: BigNumberish,
      dataPoint: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    simulateInterestGained(
      amt: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    title(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    userDeposit(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    userToDeposits(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    userWithdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addDetermination(
      contractAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    approvePool(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    approvedSubgraphPivotTarget(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bonusPayout(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    calculatePTokenBurn(
      depositTokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    currentDepositHoldingAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    currentTargetSubgraphAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    depositTokenAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deposited(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    depositedUserCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    despositedRecordedBlock(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    determinationContractAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    determinePivot(
      pivotTargetPoolId: BytesLike,
      subgraphContract: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    disapprovePool(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getSubgraphTimeseriesDataPoint(
      subgraphContractAddress: string,
      index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initializePoolTokens(
      senderAddress: string,
      initialDepositAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    latestSubgraphTimeseries(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pTokenAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    percent(
      numerator: BigNumberish,
      denominator: BigNumberish,
      precision: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pivotDeposit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    pivotWithdraw(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    poolApproved(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolMetaData(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolStatistics(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    protocolFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    reserveContractAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setReserveContractAddress(
      contractAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSubgraphTimeseriesDataPoint(
      subgraphContractAddress: string,
      index: BigNumberish,
      dataPoint: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    simulateInterestGained(
      amt: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    title(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    userDeposit(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    userToDeposits(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    userWithdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
