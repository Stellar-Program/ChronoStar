import { logger } from '../logger.js';

export class DCAWatcher {
  constructor(sorobanClient, contractId) {
    this.client = sorobanClient;
    this.contractId = contractId;
    this.interval = null;
  }

  start(pollIntervalMs) {
    logger.info({ contractId: this.contractId }, 'DCAWatcher started');
    this.poll();
    this.interval = setInterval(() => this.poll(), pollIntervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  async poll() {
    try {
      const dcaCount = await this.client.readContract(
        this.contractId,
        'dca_count',
        [],
      );
      if (!dcaCount) return;

      const numDcas = Number(dcaCount);
      for (let i = 1; i <= numDcas; i++) {
        const dca = await this.client.readContract(
          this.contractId,
          'get_dca',
          [new (await import('@stellar/stellar-sdk')).xdr.ScVal.scvU64(i)],
        );
        if (!dca || !dca._attributes || dca._attributes.status !== 0) continue;

        const currentSeq = Number(await this.client.readContract(this.contractId, 'current_ledger', []));
        const nextExec = Number(dca._attributes.next_execution_ledger);

        if (currentSeq >= nextExec) {
          logger.info({ dcaId: i }, 'executing DCA swap');
          await this.client.invokeContract(this.contractId, 'execute_swap', [
            new (await import('@stellar/stellar-sdk')).xdr.ScVal.scvU64(i),
          ]);
        }
      }
    } catch (err) {
      logger.error({ err: err.message }, 'DCAWatcher poll error');
    }
  }
}
