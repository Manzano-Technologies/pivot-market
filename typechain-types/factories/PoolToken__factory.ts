/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PoolToken, PoolTokenInterface } from "../PoolToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
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
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000fa938038062000fa9833981016040819052620000349162000251565b8151829082906200004d906003906020850190620000de565b50805162000063906004906020840190620000de565b505050620000806200007a6200008860201b60201c565b6200008c565b5050620002f8565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620000ec90620002bb565b90600052602060002090601f0160209004810192826200011057600085556200015b565b82601f106200012b57805160ff19168380011785556200015b565b828001600101855582156200015b579182015b828111156200015b5782518255916020019190600101906200013e565b50620001699291506200016d565b5090565b5b808211156200016957600081556001016200016e565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001ac57600080fd5b81516001600160401b0380821115620001c957620001c962000184565b604051601f8301601f19908116603f01168101908282118183101715620001f457620001f462000184565b816040528381526020925086838588010111156200021157600080fd5b600091505b8382101562000235578582018301518183018401529082019062000216565b83821115620002475760008385830101525b9695505050505050565b600080604083850312156200026557600080fd5b82516001600160401b03808211156200027d57600080fd5b6200028b868387016200019a565b93506020850151915080821115620002a257600080fd5b50620002b1858286016200019a565b9150509250929050565b600181811c90821680620002d057607f821691505b60208210811415620002f257634e487b7160e01b600052602260045260246000fd5b50919050565b610ca180620003086000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c806370a08231116100a257806395d89b411161007157806395d89b411461021f578063a457c2d714610227578063a9059cbb1461023a578063dd62ed3e1461024d578063f2fde38b1461026057600080fd5b806370a08231146101c0578063715018a6146101e957806379cc6790146101f15780638da5cb5b1461020457600080fd5b8063313ce567116100de578063313ce56714610176578063395093511461018557806340c10f191461019857806342966c68146101ad57600080fd5b806306fdde0314610110578063095ea7b31461012e57806318160ddd1461015157806323b872dd14610163575b600080fd5b610118610273565b6040516101259190610ac5565b60405180910390f35b61014161013c366004610b36565b610305565b6040519015158152602001610125565b6002545b604051908152602001610125565b610141610171366004610b60565b61031d565b60405160128152602001610125565b610141610193366004610b36565b610341565b6101ab6101a6366004610b36565b610363565b005b6101ab6101bb366004610b9c565b610379565b6101556101ce366004610bb5565b6001600160a01b031660009081526020819052604090205490565b6101ab610386565b6101ab6101ff366004610b36565b61039a565b6005546040516001600160a01b039091168152602001610125565b6101186103af565b610141610235366004610b36565b6103be565b610141610248366004610b36565b61043e565b61015561025b366004610bd7565b61044c565b6101ab61026e366004610bb5565b610477565b60606003805461028290610c0a565b80601f01602080910402602001604051908101604052809291908181526020018280546102ae90610c0a565b80156102fb5780601f106102d0576101008083540402835291602001916102fb565b820191906000526020600020905b8154815290600101906020018083116102de57829003601f168201915b5050505050905090565b6000336103138185856104ed565b5060019392505050565b60003361032b858285610612565b61033685858561068c565b506001949350505050565b600033610313818585610354838361044c565b61035e9190610c45565b6104ed565b61036b610830565b610375828261088a565b5050565b6103833382610949565b50565b61038e610830565b6103986000610a73565b565b6103a5823383610612565b6103758282610949565b60606004805461028290610c0a565b600033816103cc828661044c565b9050838110156104315760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b61033682868684036104ed565b60003361031381858561068c565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61047f610830565b6001600160a01b0381166104e45760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610428565b61038381610a73565b6001600160a01b03831661054f5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610428565b6001600160a01b0382166105b05760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610428565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b600061061e848461044c565b9050600019811461068657818110156106795760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610428565b61068684848484036104ed565b50505050565b6001600160a01b0383166106f05760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610428565b6001600160a01b0382166107525760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610428565b6001600160a01b038316600090815260208190526040902054818110156107ca5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610428565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610686565b6005546001600160a01b031633146103985760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610428565b6001600160a01b0382166108e05760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610428565b80600260008282546108f29190610c45565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6001600160a01b0382166109a95760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610428565b6001600160a01b03821660009081526020819052604090205481811015610a1d5760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610428565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101610605565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600060208083528351808285015260005b81811015610af257858101830151858201604001528201610ad6565b81811115610b04576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b0381168114610b3157600080fd5b919050565b60008060408385031215610b4957600080fd5b610b5283610b1a565b946020939093013593505050565b600080600060608486031215610b7557600080fd5b610b7e84610b1a565b9250610b8c60208501610b1a565b9150604084013590509250925092565b600060208284031215610bae57600080fd5b5035919050565b600060208284031215610bc757600080fd5b610bd082610b1a565b9392505050565b60008060408385031215610bea57600080fd5b610bf383610b1a565b9150610c0160208401610b1a565b90509250929050565b600181811c90821680610c1e57607f821691505b60208210811415610c3f57634e487b7160e01b600052602260045260246000fd5b50919050565b60008219821115610c6657634e487b7160e01b600052601160045260246000fd5b50019056fea2646970667358221220cbbfe39938a1b68a781a75ff8996d18f62f3b89f19b09b474db6480bb7f6089a64736f6c63430008090033";

type PoolTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PoolTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PoolToken__factory extends ContractFactory {
  constructor(...args: PoolTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "PoolToken";
  }

  deploy(
    name: string,
    symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PoolToken> {
    return super.deploy(name, symbol, overrides || {}) as Promise<PoolToken>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  attach(address: string): PoolToken {
    return super.attach(address) as PoolToken;
  }
  connect(signer: Signer): PoolToken__factory {
    return super.connect(signer) as PoolToken__factory;
  }
  static readonly contractName: "PoolToken";
  public readonly contractName: "PoolToken";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PoolTokenInterface {
    return new utils.Interface(_abi) as PoolTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PoolToken {
    return new Contract(address, _abi, signerOrProvider) as PoolToken;
  }
}
