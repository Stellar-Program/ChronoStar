import { Router } from 'express';

export function createStatsRouter(clients) {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      const stats = { vaults: { total: 0, active: 0, released: 0 }, streams: { total: 0, active: 0, completed: 0 }, dca: { total: 0, active: 0, exhausted: 0 }, totalValueLocked: '0' };

      for (const [key, { client, contractId }] of Object.entries(clients)) {
        const countFn = key === 'vault' ? 'vault_count' : key === 'stream' ? 'stream_count' : 'dca_count';
        const getFn = key === 'vault' ? 'get_vault' : key === 'stream' ? 'get_stream' : 'get_dca';

        const count = await client.readContract(contractId, countFn, []);
        if (!count) continue;

        const group = key === 'dca' ? 'dca' : key + 's';
        stats[group].total = count;

        for (let i = 1; i <= count; i++) {
          const item = await client.readContract(contractId, getFn, [client.scvU64(i)]);
          if (!item) continue;

          const status = item.status;
          if (key === 'vault') {
            if (status === 0) stats.vaults.active++;
            else if (status === 1) stats.vaults.released++;
          } else if (key === 'stream') {
            if (status === 0) stats.streams.active++;
            else if (status === 1) stats.streams.completed++;
          } else if (key === 'dca') {
            if (status === 0) stats.dca.active++;
            else if (status === 1) stats.dca.exhausted++;
          }
        }
      }

      res.json(stats);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
