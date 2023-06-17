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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "simulatedPositionBalance",
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
  "0x60a06040526007805460ff60a01b19169055600060805234801561002257600080fd5b50604051611403380380611403833981016040819052610041916100b5565b61004a33610065565b50600780546001600160a01b031916331790556009556100f2565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080604083850312156100c857600080fd5b825160208401519092506001600160a01b03811681146100e757600080fd5b809150509250929050565b6080516112f961010a600039600050506112f96000f3fe608060405234801561001057600080fd5b50600436106101725760003560e01c806385fd04a8116100de578063c250283c11610097578063e567e86911610071578063e567e86914610382578063e60dbb881461038b578063ea0021081461039f578063f2fde38b146103b257600080fd5b8063c250283c14610326578063ca66d4a014610339578063de6483cc1461036257600080fd5b806385fd04a8146102b45780638da5cb5b146102bc5780639ce15f92146102cd578063a0d2c937146102e0578063aa9e4e5414610300578063b40f982c1461031357600080fd5b80634591f2d3116101305780634591f2d31461021a5780634b9778761461023a5780635e1661991461024357806367651dfe1461024b578063715018a61461026b5780637abf0bc81461027357600080fd5b80622c1a9e146101775780630bff28ec1461019d57806320f458db146101c1578063228ccff8146101d457806323a708d7146101f45780632a11d4b814610207575b600080fd5b61018a610185366004610ff0565b6103c5565b6040519081526020015b60405180910390f35b6007546101b190600160a01b900460ff1681565b6040519015158152602001610194565b6101b16101cf36600461103f565b610417565b61018a6101e2366004611081565b60026020526000908152604090205481565b610205610202366004611081565b50565b005b61018a610215366004611081565b610780565b61018a610228366004611081565b60036020526000908152604090205481565b61018a60085481565b610205610836565b61018a610259366004611081565b60046020526000908152604090205481565b610205610888565b61029c610281366004611081565b6001602052600090815260409020546001600160a01b031681565b6040516001600160a01b039091168152602001610194565b61020561089c565b6000546001600160a01b031661029c565b6102056102db3660046110a5565b6108e2565b61018a6102ee366004611081565b60056020526000908152604090205481565b61029c61030e3660046110a5565b503090565b610205610321366004611081565b6108ef565b6101b16103343660046110be565b61096f565b61018a610347366004611081565b6001600160a01b03166000908152600a602052604090205490565b61018a610370366004611081565b600a6020526000908152604090205481565b61018a60095481565b6101b1610399366004611081565b50600090565b6102056103ad3660046110a5565b610c6a565b6102056103c0366004611081565b610da3565b6000806103d3836001611127565b6103de90600a611225565b6103e89086611231565b90506000600a6103f88684611250565b610403906005611127565b61040d9190611250565b9695505050505050565b60008261046b5760405162461bcd60e51b815260206004820152601e60248201527f57697468647261772076616c7565206d7573742062652061626f76652030000060448201526064015b60405180910390fd5b336000818152600660205260409020546001600160a01b031683861515600114156104935750815b6001600160a01b03838116600090815260016020908152604080832054909316808352600a90915291812054906104c986610780565b6001600160a01b0380881660009081526002602090815260408083205493881683526004909152902054919250908a83141561055b576001600160a01b038089166000908152600560209081526040808320549389168352600490915281208054909190610538908490611272565b90915550506001600160a01b0388166000908152600560205260408120556105e6565b6001600160a01b0380891660009081526005602090815260408083205493891683526004909152812054909161059091611272565b905061059c8286611250565b6105a6908d611250565b6001600160a01b038a1660009081526005602052604090208190556105cb9082611127565b6001600160a01b038716600090815260046020526040902055505b6105f388848d6001610e19565b61060085858d6001610e76565b6001600160a01b03881660009081526002602052604090205461062857610628886000610f18565b818b11156106a0576040805162461bcd60e51b81526020600482015260248101919091527f506f6f6c2042616c616e6365206d75737420626520677265617465722074686160448201527f6e206f7220657175616c20746f207265717565737465642077697468647261776064820152608401610462565b60405163a9059cbb60e01b81526001600160a01b038781166004830152602482018d90526000919089169063a9059cbb90604401602060405180830381600087803b1580156106ee57600080fd5b505af1158015610702573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107269190611289565b905060018115151461076d5760405162461bcd60e51b815260206004820152601060248201526f5472616e73666572204661696c65642160801b6044820152606401610462565b5060019c9b505050505050505050505050565b6001600160a01b038082166000908152600160209081526040808320549093168083526004909152918120549091906107bc5750600092915050565b6001600160a01b0381166000908152600a6020526040902054806107e4575060009392505050565b6001600160a01b038216600090815260046020819052604082205461080b918491906103c5565b6001600160a01b03861660009081526005602052604081205491925090612710906104039084611231565b61083e610f46565b6007805460ff60a01b1916600160a01b179055604051600181527fbf566f7ffac9cb664ec11d47aa078c63570d0e55e35d5cdaf12510aaf6067919906020015b60405180910390a1565b610890610f46565b61089a6000610fa0565b565b6108a4610f46565b6007805460ff60a01b19169055604051600081527fbf566f7ffac9cb664ec11d47aa078c63570d0e55e35d5cdaf12510aaf60679199060200161087e565b6108ea610f46565b600855565b6108f7610f46565b6001600160a01b03811661094d5760405162461bcd60e51b815260206004820152601f60248201527f43616e6e6f742062652073657420746f2061205a45524f2041646472657373006044820152606401610462565b600780546001600160a01b0319166001600160a01b0392909216919091179055565b336000818152600660205260408120549091906001600160a01b03166109be576001600160a01b03818116600090815260066020526040902080546001600160a01b0319169187169190911790555b6001600160a01b0384166000908152600a6020526040812054906109e183610780565b6001600160a01b03848116600090815260066020526040902054919250888116911614610a6f5760405162461bcd60e51b815260206004820152603660248201527f496e76616c6964206465706f736974546f6b656e41646472657373207061737360448201527532b2103a37903232b837b9b4ba10333ab731ba34b7b760511b6064820152608401610462565b6001600160a01b03861660009081526004602052604090205480610ac3576001600160a01b038085166000908152600560209081526040808320620f424090819055938b1683526004909152902055610b3b565b600081610ad0858c611250565b610ada9190611231565b6001600160a01b038616600090815260056020526040812080549293508392909190610b07908490611127565b90915550506001600160a01b03881660009081526004602052604081208054839290610b34908490611127565b9091555050505b610b4884838b6000610e19565b610b5587848b6000610e76565b6001600160a01b03808516600090815260016020526040902054888216911614610b8357610b838488610f18565b6040516323b872dd60e01b81526001600160a01b038781166004830152306024830152604482018b9052600091908a16906323b872dd90606401602060405180830381600087803b158015610bd757600080fd5b505af1158015610beb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c0f9190611289565b9050600181151514610c5a5760405162461bcd60e51b81526020600482015260146024820152737472616e7366657246726f6d206661696c65642160601b6044820152606401610462565b5060019998505050505050505050565b336000818152600160205260408120546001600160a01b031690610ca3826001600160a01b03166000908152600a602052604090205490565b90506000610cb084610780565b9050610cbf8482876000610e19565b60008490506000816001600160a01b03166323dc9e376040518163ffffffff1660e01b815260040160206040518083038186803b158015610cff57600080fd5b505afa158015610d13573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d3791906112a6565b6040516340c10f1960e01b8152306004820152602481018990529091506001600160a01b038216906340c10f1990604401600060405180830381600087803b158015610d8257600080fd5b505af1158015610d96573d6000803e3d6000fd5b5050505050505050505050565b610dab610f46565b6001600160a01b038116610e105760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610462565b61020281610fa0565b60018115151415610e4c57610e2e8284611272565b6001600160a01b038516600090815260026020526040902055610e70565b610e568284611127565b6001600160a01b0385166000908152600260205260409020555b50505050565b60018115151415610ecc57610e8b8284611272565b6001600160a01b038516600090815260036020526040902055610eae8284611272565b6001600160a01b0385166000908152600a6020526040902055610e70565b610ed68284611127565b6001600160a01b038516600090815260036020526040902055610ef98284611127565b6001600160a01b0385166000908152600a602052604090205550505050565b6001600160a01b03918216600090815260016020526040902080546001600160a01b03191691909216179055565b6000546001600160a01b0316331461089a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610462565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60008060006060848603121561100557600080fd5b505081359360208301359350604090920135919050565b801515811461020257600080fd5b6001600160a01b038116811461020257600080fd5b60008060006060848603121561105457600080fd5b833561105f8161101c565b92506020840135915060408401356110768161102a565b809150509250925092565b60006020828403121561109357600080fd5b813561109e8161102a565b9392505050565b6000602082840312156110b757600080fd5b5035919050565b600080600080608085870312156110d457600080fd5b8435935060208501356110e68161102a565b925060408501356110f68161102a565b915060608501356111068161102a565b939692955090935050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561113a5761113a611111565b500190565b600181815b8085111561117a57816000190482111561116057611160611111565b8085161561116d57918102915b93841c9390800290611144565b509250929050565b6000826111915750600161121f565b8161119e5750600061121f565b81600181146111b457600281146111be576111da565b600191505061121f565b60ff8411156111cf576111cf611111565b50506001821b61121f565b5060208310610133831016604e8410600b84101617156111fd575081810a61121f565b611207838361113f565b806000190482111561121b5761121b611111565b0290505b92915050565b600061109e8383611182565b600081600019048311821515161561124b5761124b611111565b500290565b60008261126d57634e487b7160e01b600052601260045260246000fd5b500490565b60008282101561128457611284611111565b500390565b60006020828403121561129b57600080fd5b815161109e8161101c565b6000602082840312156112b857600080fd5b815161109e8161102a56fea2646970667358221220f3d86a392527328ed0f6faacf9eed9bb0b39649e1a405d793791b66a4ecceac064736f6c63430008090033";

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
