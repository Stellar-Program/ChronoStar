import { logger } from '../logger.js';

export class StreamWatcher {
  constructor(sorobanClient, contractId) {
    this.client = sorobanClient;
    this.contractId = contractId;
    this.interval = null;
  }

  start(pollIntervalMs) {
    logger.info({ contractId: this.contractId }, 'StreamWatcher started');
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
      const streamCount = await this.client.readContract(
        this.contractId,
        'stream_count',
        [],
      );
      if (!streamCount) return;

      const numStreams = Number(streamCount);
      for (let i = 1; i <= numStreams; i++) {
        const stream = await this.client.readContract(
          this.contractId,
          'get_stream',
          [new (await import('@stellar/stellar-sdk')).xdr.ScVal.scvU64(i)],
        );
        if (!stream || !stream._attributes || stream._attributes.status !== 0) continue;

        const currentSeq = Number(await this.client.readContract(this.contractId, 'current_ledger', []));
        const endLedger = Number(stream._attributes.end_ledger);

        if (currentSeq >= endLedger) {
          logger.info({ streamId: i }, 'ticking completed stream');
          await this.client.invokeContract(this.contractId, 'tick', [
            new (await import('@stellar/stellar-sdk')).xdr.ScVal.scvU64(i),
          ]);
        }
      }
    } catch (err) {
      logger.error({ err: err.message }, 'StreamWatcher poll error');
    }
  }
}
