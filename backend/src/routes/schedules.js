import { Router } from 'express';

export function createSchedulesRouter(client, contractId) {
  const router = Router();

  router.get('/:address', async (req, res, next) => {
    try {
      const address = req.params.address;
      const vaultIds = await client.readContract(
        contractId,
        'get_vaults_by_owner',
        [client.scvAddress(address)],
      );
      if (!vaultIds) return res.json([]);

      const ids = vaultIds?._attributes?.arr?.map(a => Number(a._attributes?.u64 ?? a)) ?? [];
      const vaults = await Promise.all(
        ids.map(id => client.readContract(contractId, 'get_vault', [client.scvU64(id)])),
      );
      res.json(vaults.map(v => ({ id: ids[vaults.indexOf(v)], ...(v?._attributes ?? v) })));
    } catch (err) {
      next(err);
    }
  });

  return router;
}
