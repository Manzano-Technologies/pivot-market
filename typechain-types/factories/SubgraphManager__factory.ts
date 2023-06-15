/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BytesLike,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SubgraphManager,
  SubgraphManagerInterface,
} from "../SubgraphManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "protocol",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "reserveContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
    ],
    name: "ApprovalChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "approveSubgraph",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "poolAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "currentPositionValue",
        type: "uint256",
      },
    ],
    name: "currentPoolBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "currentPositionBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "depositTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "pivotTargetAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "originalSender",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "bool",
        name: "depositSuccess",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "depositsByPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "depositsByPosition",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "disapproveSubgraph",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "emergencyFundWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "pivotTargetPoolId",
        type: "bytes32",
      },
    ],
    name: "getDepositAddressByPoolId",
    outputs: [
      {
        internalType: "address",
        name: "depositAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "numerator",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "denominator",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "precision",
        type: "uint256",
      },
    ],
    name: "percent",
    outputs: [
      {
        internalType: "uint256",
        name: "quotient",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "poolFactor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "poolToDepositHoldingRegistry",
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
  {
    inputs: [],
    name: "protocolName",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "URI",
        type: "bytes32",
      },
    ],
    name: "setSubgraphQueryURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "simulateInterestGained",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "subgraphApproved",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "subgraphQueryURI",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "targetFactor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "targetAddress",
        type: "address",
      },
    ],
    name: "targetVerifier",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "updateroyaltyUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "isPivot",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "destination",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "bool",
        name: "withdrawSent",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040526007805460ff60a01b19169055600060805234801561002257600080fd5b506040516113ab3803806113ab833981016040819052610041916100b5565b61004a33610065565b50600780546001600160a01b031916331790556009556100f2565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080604083850312156100c857600080fd5b825160208401519092506001600160a01b03811681146100e757600080fd5b809150509250929050565b6080516112a161010a600039600050506112a16000f3fe608060405234801561001057600080fd5b50600436106101575760003560e01c806385fd04a8116100c3578063c250283c1161007c578063c250283c1461030b578063ca66d4a01461031e578063e567e86914610347578063e60dbb8814610350578063ea00210814610364578063f2fde38b1461037757600080fd5b806385fd04a8146102995780638da5cb5b146102a15780639ce15f92146102b2578063a0d2c937146102c5578063aa9e4e54146102e5578063b40f982c146102f857600080fd5b80634b977876116101155780634b9778761461020c5780635e1661991461021557806367651dfe1461021d578063693521571461023d578063715018a6146102505780637abf0bc81461025857600080fd5b80622c1a9e1461015c5780630bff28ec1461018257806320f458db146101a6578063228ccff8146101b957806323a708d7146101d95780634591f2d3146101ec575b600080fd5b61016f61016a366004610f6e565b61038a565b6040519081526020015b60405180910390f35b60075461019690600160a01b900460ff1681565b6040519015158152602001610179565b6101966101b4366004610fbd565b6103dc565b61016f6101c7366004610fff565b60026020526000908152604090205481565b6101ea6101e7366004610fff565b50565b005b61016f6101fa366004610fff565b60036020526000908152604090205481565b61016f60085481565b6101ea6106fc565b61016f61022b366004610fff565b60046020526000908152604090205481565b61016f61024b366004611023565b61074e565b6101ea610804565b610281610266366004610fff565b6001602052600090815260409020546001600160a01b031681565b6040516001600160a01b039091168152602001610179565b6101ea610818565b6000546001600160a01b0316610281565b6101ea6102c036600461104f565b61085e565b61016f6102d3366004610fff565b60056020526000908152604090205481565b6102816102f336600461104f565b503090565b6101ea610306366004610fff565b61086b565b610196610319366004611068565b6108eb565b61016f61032c366004610fff565b6001600160a01b03166000908152600a602052604090205490565b61016f60095481565b61019661035e366004610fff565b50600090565b6101ea61037236600461104f565b610be7565b6101ea610385366004610fff565b610d21565b6000806103988360016110d1565b6103a390600a6111cd565b6103ad90866111d9565b90506000600a6103bd86846111f8565b6103c89060056110d1565b6103d291906111f8565b9695505050505050565b336000818152600660205260408120549091906001600160a01b031683861515600114156104075750815b6001600160a01b03838116600090815260016020908152604080832054909316808352600a909152918120549061043e868361074e565b6001600160a01b0380881660009081526002602090815260408083205493881683526004909152902054919250908a8314156104d0576001600160a01b0380891660009081526005602090815260408083205493891683526004909152812080549091906104ad90849061121a565b90915550506001600160a01b03881660009081526005602052604081205561055b565b6001600160a01b038089166000908152600560209081526040808320549389168352600490915281205490916105059161121a565b905061051182866111f8565b61051b908d6111f8565b6001600160a01b038a16600090815260056020526040902081905561054090826110d1565b6001600160a01b038716600090815260046020526040902055505b61056888848d6001610d97565b61057585858d6001610df4565b6001600160a01b0388166000908152600260205260409020548b1061059f5761059f886000610e96565b818b111561061c576040805162461bcd60e51b81526020600482015260248101919091527f506f6f6c2042616c616e6365206d75737420626520677265617465722074686160448201527f6e206f7220657175616c20746f2072657175657374656420776974686472617760648201526084015b60405180910390fd5b60405163a9059cbb60e01b81526001600160a01b038781166004830152602482018d90526000919089169063a9059cbb90604401602060405180830381600087803b15801561066a57600080fd5b505af115801561067e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106a29190611231565b90506001811515146106e95760405162461bcd60e51b815260206004820152601060248201526f5472616e73666572204661696c65642160801b6044820152606401610613565b5060019c9b505050505050505050505050565b610704610ec4565b6007805460ff60a01b1916600160a01b179055604051600181527fbf566f7ffac9cb664ec11d47aa078c63570d0e55e35d5cdaf12510aaf6067919906020015b60405180910390a1565b6001600160a01b03808316600090815260016020526040812054909116828061079b57506001600160a01b0381166000908152600a60205260409020548061079b576000925050506107fe565b6001600160a01b03821660009081526004602081905260408220546107c29184919061038a565b6001600160a01b03871660009081526005602052604081205491925090612710906107ed90846111d9565b6107f791906111f8565b9450505050505b92915050565b61080c610ec4565b6108166000610f1e565b565b610820610ec4565b6007805460ff60a01b19169055604051600081527fbf566f7ffac9cb664ec11d47aa078c63570d0e55e35d5cdaf12510aaf606791990602001610744565b610866610ec4565b600855565b610873610ec4565b6001600160a01b0381166108c95760405162461bcd60e51b815260206004820152601f60248201527f43616e6e6f742062652073657420746f2061205a45524f2041646472657373006044820152606401610613565b600780546001600160a01b0319166001600160a01b0392909216919091179055565b336000818152600660205260408120549091906001600160a01b031661093a576001600160a01b03818116600090815260066020526040902080546001600160a01b0319169187169190911790555b6001600160a01b0384166000908152600a60205260408120549061095e838361074e565b6001600160a01b038481166000908152600660205260409020549192508881169116146109ec5760405162461bcd60e51b815260206004820152603660248201527f496e76616c6964206465706f736974546f6b656e41646472657373207061737360448201527532b2103a37903232b837b9b4ba10333ab731ba34b7b760511b6064820152608401610613565b6001600160a01b03861660009081526004602052604090205480610a40576001600160a01b038085166000908152600560209081526040808320620f424090819055938b1683526004909152902055610ab8565b600081610a4d858c6111f8565b610a5791906111d9565b6001600160a01b038616600090815260056020526040812080549293508392909190610a849084906110d1565b90915550506001600160a01b03881660009081526004602052604081208054839290610ab19084906110d1565b9091555050505b610ac584838b6000610d97565b610ad287848b6000610df4565b6001600160a01b03808516600090815260016020526040902054888216911614610b0057610b008488610e96565b6040516323b872dd60e01b81526001600160a01b038781166004830152306024830152604482018b9052600091908a16906323b872dd90606401602060405180830381600087803b158015610b5457600080fd5b505af1158015610b68573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b8c9190611231565b9050600181151514610bd75760405162461bcd60e51b81526020600482015260146024820152737472616e7366657246726f6d206661696c65642160601b6044820152606401610613565b5060019998505050505050505050565b336000818152600160205260408120546001600160a01b031690610c20826001600160a01b03166000908152600a602052604090205490565b90506000610c2e848361074e565b9050610c3d8482876000610d97565b60008490506000816001600160a01b03166323dc9e376040518163ffffffff1660e01b815260040160206040518083038186803b158015610c7d57600080fd5b505afa158015610c91573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cb5919061124e565b6040516340c10f1960e01b8152306004820152602481018990529091506001600160a01b038216906340c10f1990604401600060405180830381600087803b158015610d0057600080fd5b505af1158015610d14573d6000803e3d6000fd5b5050505050505050505050565b610d29610ec4565b6001600160a01b038116610d8e5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610613565b6101e781610f1e565b60018115151415610dca57610dac828461121a565b6001600160a01b038516600090815260026020526040902055610dee565b610dd482846110d1565b6001600160a01b0385166000908152600260205260409020555b50505050565b60018115151415610e4a57610e09828461121a565b6001600160a01b038516600090815260036020526040902055610e2c828461121a565b6001600160a01b0385166000908152600a6020526040902055610dee565b610e5482846110d1565b6001600160a01b038516600090815260036020526040902055610e7782846110d1565b6001600160a01b0385166000908152600a602052604090205550505050565b6001600160a01b03918216600090815260016020526040902080546001600160a01b03191691909216179055565b6000546001600160a01b031633146108165760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610613565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080600060608486031215610f8357600080fd5b505081359360208301359350604090920135919050565b80151581146101e757600080fd5b6001600160a01b03811681146101e757600080fd5b600080600060608486031215610fd257600080fd5b8335610fdd81610f9a565b9250602084013591506040840135610ff481610fa8565b809150509250925092565b60006020828403121561101157600080fd5b813561101c81610fa8565b9392505050565b6000806040838503121561103657600080fd5b823561104181610fa8565b946020939093013593505050565b60006020828403121561106157600080fd5b5035919050565b6000806000806080858703121561107e57600080fd5b84359350602085013561109081610fa8565b925060408501356110a081610fa8565b915060608501356110b081610fa8565b939692955090935050565b634e487b7160e01b600052601160045260246000fd5b600082198211156110e4576110e46110bb565b500190565b600181815b8085111561112457816000190482111561110a5761110a6110bb565b8085161561111757918102915b93841c93908002906110ee565b509250929050565b60008261113b575060016107fe565b81611148575060006107fe565b816001811461115e576002811461116857611184565b60019150506107fe565b60ff841115611179576111796110bb565b50506001821b6107fe565b5060208310610133831016604e8410600b84101617156111a7575081810a6107fe565b6111b183836110e9565b80600019048211156111c5576111c56110bb565b029392505050565b600061101c838361112c565b60008160001904831182151516156111f3576111f36110bb565b500290565b60008261121557634e487b7160e01b600052601260045260246000fd5b500490565b60008282101561122c5761122c6110bb565b500390565b60006020828403121561124357600080fd5b815161101c81610f9a565b60006020828403121561126057600080fd5b815161101c81610fa856fea2646970667358221220cf6cf79dedbd002ebb7484d660d84839cb0825c83af4fd928280c530c95573a164736f6c63430008090033";

type SubgraphManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SubgraphManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SubgraphManager__factory extends ContractFactory {
  constructor(...args: SubgraphManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "SubgraphManager";
  }

  deploy(
    protocol: BytesLike,
    reserveContract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SubgraphManager> {
    return super.deploy(
      protocol,
      reserveContract,
      overrides || {}
    ) as Promise<SubgraphManager>;
  }
  getDeployTransaction(
    protocol: BytesLike,
    reserveContract: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      protocol,
      reserveContract,
      overrides || {}
    );
  }
  attach(address: string): SubgraphManager {
    return super.attach(address) as SubgraphManager;
  }
  connect(signer: Signer): SubgraphManager__factory {
    return super.connect(signer) as SubgraphManager__factory;
  }
  static readonly contractName: "SubgraphManager";
  public readonly contractName: "SubgraphManager";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SubgraphManagerInterface {
    return new utils.Interface(_abi) as SubgraphManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SubgraphManager {
    return new Contract(address, _abi, signerOrProvider) as SubgraphManager;
  }
}
