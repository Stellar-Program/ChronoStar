import { logger } from '../logger.js';

export class VaultWatcher {
  constructor(sorobanClient, contractId) {
    this.client = sorobanClient;
    this.contractId = contractId;
    this.interval = null;
  }

  start(pollIntervalMs) {
    logger.info({ contractId: this.contractId }, 'VaultWatcher started');
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
      const currentLedger = await this.client.readContract(
        this.contractId,
        'current_ledger',
        [],
      );
      if (!currentLedger) return;

      const vaultCount = await this.client.readContract(
        this.contractId,
        'vault_count',
        [],
      );
      if (!vaultCount) return;

      const numVaults = Number(vaultCount);
      for (let i = 1; i <= numVaults; i++) {
        const vault = await this.client.readContract(
          this.contractId,
          'get_vault',
          [new (await import('@stellar/stellar-sdk')).xdr.ScVal.scvU64(i)],
        );
        if (!vault || !vault._attributes || vault._attributes.status !== 0) continue;

        const releaseLedger = Number(vault._attributes.release_ledger);
        const currentSeq = Number(currentLedger);
        if (currentSeq >= releaseLedger) {
          logger.info({ vaultId: i }, 'releasing vault');
          await this.client.invokeContract(this.contractId, 'release', [
            new (await import('@stellar/stellar-sdk')).xdr.ScVal.scvU64(i),
          ]);
        }
      }
    } catch (err) {
      logger.error({ err: err.message }, 'VaultWatcher poll error');
    }
  }
}
