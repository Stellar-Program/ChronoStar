import { Router } from 'express';

export function createStreamsRouter(client, contractId) {
  const router = Router();

  router.get('/:address', async (req, res, next) => {
    try {
      const address = req.params.address;
      const [ownerStreams, recipientStreams] = await Promise.all([
        client.readContract(contractId, 'get_streams_by_owner', [client.scvAddress(address)]),
        client.readContract(contractId, 'get_streams_by_recipient', [client.scvAddress(address)]),
      ]);

      const ids = new Set();
      const addIds = (vec) => {
        const arr = vec?._attributes?.arr ?? [];
        for (const a of arr) ids.add(Number(a._attributes?.u64 ?? a));
      };
      if (ownerStreams) addIds(ownerStreams);
      if (recipientStreams) addIds(recipientStreams);

      const streams = await Promise.all(
        [...ids].map(id => client.readContract(contractId, 'get_stream', [client.scvU64(id)])),
      );
      res.json(streams.map(s => s?._attributes ?? s).filter(Boolean));
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export function createDCARouter(client, contractId) {
  const router = Router();

  router.get('/:address', async (req, res, next) => {
    try {
      const address = req.params.address;
      const dcaIds = await client.readContract(
        contractId,
        'get_dcas_by_owner',
        [client.scvAddress(address)],
      );
      if (!dcaIds) return res.json([]);

      const ids = dcaIds?._attributes?.arr?.map(a => Number(a._attributes?.u64 ?? a)) ?? [];
      const dcas = await Promise.all(
        ids.map(id => client.readContract(contractId, 'get_dca', [client.scvU64(id)])),
      );
      res.json(dcas.map(d => d?._attributes ?? d));
    } catch (err) {
      next(err);
    }
  });

  return router;
}
