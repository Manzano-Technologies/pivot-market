/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IPoopManager, IPoopManagerInterface } from "../IPoopManager";

const _abi = [
  {
    inputs: [],
    name: "deployTestToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reserveContractAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "title",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "zing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IPoopManager__factory {
  static readonly abi = _abi;
  static createInterface(): IPoopManagerInterface {
    return new utils.Interface(_abi) as IPoopManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPoopManager {
    return new Contract(address, _abi, signerOrProvider) as IPoopManager;
  }
}
