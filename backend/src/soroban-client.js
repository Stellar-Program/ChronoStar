import { rpc, Contract, xdr, Address } from '@stellar/stellar-sdk';
import { config } from './config.js';
import { logger } from './logger.js';

export class SorobanClient {
  constructor() {
    this.server = new rpc.Server(config.rpcUrl);
  }

  async simulate(contractId, method, args) {
    const contract = new Contract(contractId);
    const fn = contract.call(method, ...args);
    const simulation = await this.server.simulateTransaction(fn);
    return simulation;
  }

  async readContract(contractId, method, args) {
    const sim = await this.simulate(contractId, method, args);
    return sim?.result?.retval ?? null;
  }

  scvU64(val) { return xdr.ScVal.scvU64(val); }
  scvAddress(addr) {
    return Address.fromString(addr).toScVal();
  }
}
