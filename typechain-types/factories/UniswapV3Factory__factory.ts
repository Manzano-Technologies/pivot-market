/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  UniswapV3Factory,
  UniswapV3FactoryInterface,
} from "../UniswapV3Factory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    name: "getPool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class UniswapV3Factory__factory {
  static readonly abi = _abi;
  static createInterface(): UniswapV3FactoryInterface {
    return new utils.Interface(_abi) as UniswapV3FactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapV3Factory {
    return new Contract(address, _abi, signerOrProvider) as UniswapV3Factory;
  }
}
