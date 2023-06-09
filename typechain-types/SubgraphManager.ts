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

export interface SubgraphManagerInterface extends utils.Interface {
  contractName: "SubgraphManager";
  functions: {
    "approveSubgraph()": FunctionFragment;
    "currentPoolBalance(address)": FunctionFragment;
    "currentPositionBalance(address)": FunctionFragment;
    "deposit(uint256,address,address,address)": FunctionFragment;
    "depositsByPool(address)": FunctionFragment;
    "depositsByPosition(address)": FunctionFragment;
    "disapproveSubgraph()": FunctionFragment;
    "emergencyFundWithdraw(address)": FunctionFragment;
    "getDepositAddressByPoolId(bytes32)": FunctionFragment;
    "owner()": FunctionFragment;
    "percent(uint256,uint256,uint256)": FunctionFragment;
    "poolFactor(address)": FunctionFragment;
    "poolToDepositHoldingRegistry(address)": FunctionFragment;
    "protocolName()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setSubgraphQueryURI(bytes32)": FunctionFragment;
    "simulateInterestGained(uint256)": FunctionFragment;
    "simulatedPositionBalance(address)": FunctionFragment;
    "subgraphApproved()": FunctionFragment;
    "subgraphQueryURI()": FunctionFragment;
    "targetFactor(address)": FunctionFragment;
    "targetVerifier(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateroyaltyUser(address)": FunctionFragment;
    "withdraw(bool,uint256,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approveSubgraph",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "currentPoolBalance",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "currentPositionBalance",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "depositsByPool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "depositsByPosition",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "disapproveSubgraph",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "emergencyFundWithdraw",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getDepositAddressByPoolId",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "percent",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "poolFactor", values: [string]): string;
  encodeFunctionData(
    functionFragment: "poolToDepositHoldingRegistry",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "protocolName",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setSubgraphQueryURI",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "simulateInterestGained",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "simulatedPositionBalance",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "subgraphApproved",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "subgraphQueryURI",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "targetFactor",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "targetVerifier",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateroyaltyUser",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [boolean, BigNumberish, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "approveSubgraph",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentPoolBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentPositionBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositsByPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositsByPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disapproveSubgraph",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "emergencyFundWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDepositAddressByPoolId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "percent", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "poolFactor", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "poolToDepositHoldingRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "protocolName",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSubgraphQueryURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "simulateInterestGained",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "simulatedPositionBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "subgraphApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "subgraphQueryURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "targetFactor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "targetVerifier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateroyaltyUser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

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

export interface SubgraphManager extends BaseContract {
  contractName: "SubgraphManager";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SubgraphManagerInterface;

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
    approveSubgraph(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    currentPoolBalance(
      poolAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { balance: BigNumber }>;

    currentPositionBalance(
      target: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { balance: BigNumber }>;

    deposit(
      amount: BigNumberish,
      depositTokenAddress: string,
      pivotTargetAddress: string,
      originalSender: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositsByPool(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    depositsByPosition(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    disapproveSubgraph(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    emergencyFundWithdraw(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getDepositAddressByPoolId(
      pivotTargetPoolId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { depositAddress: string }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    percent(
      numerator: BigNumberish,
      denominator: BigNumberish,
      precision: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { quotient: BigNumber }>;

    poolFactor(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    poolToDepositHoldingRegistry(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    protocolName(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSubgraphQueryURI(
      URI: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    simulateInterestGained(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    simulatedPositionBalance(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    subgraphApproved(overrides?: CallOverrides): Promise<[boolean]>;

    subgraphQueryURI(overrides?: CallOverrides): Promise<[string]>;

    targetFactor(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    targetVerifier(
      targetAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateroyaltyUser(
      user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      isPivot: boolean,
      amount: BigNumberish,
      destination: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  approveSubgraph(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  currentPoolBalance(
    poolAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  currentPositionBalance(
    target: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  deposit(
    amount: BigNumberish,
    depositTokenAddress: string,
    pivotTargetAddress: string,
    originalSender: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositsByPool(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  depositsByPosition(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  disapproveSubgraph(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  emergencyFundWithdraw(
    pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getDepositAddressByPoolId(
    pivotTargetPoolId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  percent(
    numerator: BigNumberish,
    denominator: BigNumberish,
    precision: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  poolFactor(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  poolToDepositHoldingRegistry(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<string>;

  protocolName(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSubgraphQueryURI(
    URI: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  simulateInterestGained(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  simulatedPositionBalance(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  subgraphApproved(overrides?: CallOverrides): Promise<boolean>;

  subgraphQueryURI(overrides?: CallOverrides): Promise<string>;

  targetFactor(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  targetVerifier(
    targetAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateroyaltyUser(
    user: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    isPivot: boolean,
    amount: BigNumberish,
    destination: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    approveSubgraph(overrides?: CallOverrides): Promise<void>;

    currentPoolBalance(
      poolAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentPositionBalance(
      target: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deposit(
      amount: BigNumberish,
      depositTokenAddress: string,
      pivotTargetAddress: string,
      originalSender: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    depositsByPool(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    depositsByPosition(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    disapproveSubgraph(overrides?: CallOverrides): Promise<void>;

    emergencyFundWithdraw(
      pool: string,
      overrides?: CallOverrides
    ): Promise<void>;

    getDepositAddressByPoolId(
      pivotTargetPoolId: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    percent(
      numerator: BigNumberish,
      denominator: BigNumberish,
      precision: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    poolFactor(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolToDepositHoldingRegistry(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<string>;

    protocolName(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setSubgraphQueryURI(
      URI: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    simulateInterestGained(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    simulatedPositionBalance(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    subgraphApproved(overrides?: CallOverrides): Promise<boolean>;

    subgraphQueryURI(overrides?: CallOverrides): Promise<string>;

    targetFactor(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    targetVerifier(
      targetAddress: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateroyaltyUser(user: string, overrides?: CallOverrides): Promise<void>;

    withdraw(
      isPivot: boolean,
      amount: BigNumberish,
      destination: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
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
    approveSubgraph(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    currentPoolBalance(
      poolAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentPositionBalance(
      target: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deposit(
      amount: BigNumberish,
      depositTokenAddress: string,
      pivotTargetAddress: string,
      originalSender: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositsByPool(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    depositsByPosition(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    disapproveSubgraph(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    emergencyFundWithdraw(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getDepositAddressByPoolId(
      pivotTargetPoolId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    percent(
      numerator: BigNumberish,
      denominator: BigNumberish,
      precision: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    poolFactor(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolToDepositHoldingRegistry(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    protocolName(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSubgraphQueryURI(
      URI: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    simulateInterestGained(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    simulatedPositionBalance(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    subgraphApproved(overrides?: CallOverrides): Promise<BigNumber>;

    subgraphQueryURI(overrides?: CallOverrides): Promise<BigNumber>;

    targetFactor(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    targetVerifier(
      targetAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateroyaltyUser(
      user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdraw(
      isPivot: boolean,
      amount: BigNumberish,
      destination: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approveSubgraph(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    currentPoolBalance(
      poolAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    currentPositionBalance(
      target: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deposit(
      amount: BigNumberish,
      depositTokenAddress: string,
      pivotTargetAddress: string,
      originalSender: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositsByPool(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    depositsByPosition(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    disapproveSubgraph(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    emergencyFundWithdraw(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getDepositAddressByPoolId(
      pivotTargetPoolId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    percent(
      numerator: BigNumberish,
      denominator: BigNumberish,
      precision: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    poolFactor(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    poolToDepositHoldingRegistry(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    protocolName(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSubgraphQueryURI(
      URI: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    simulateInterestGained(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    simulatedPositionBalance(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    subgraphApproved(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    subgraphQueryURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    targetFactor(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    targetVerifier(
      targetAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateroyaltyUser(
      user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      isPivot: boolean,
      amount: BigNumberish,
      destination: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
