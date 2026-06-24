import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import request from 'supertest';
import { createStatsRouter } from './stats.js';

describe('GET /api/stats', () => {
  it('returns aggregated stats', async () => {
    const client = {
      readContract: mock.fn(),
      scvU64: (v) => v,
    };

    client.readContract.mock.mockImplementation(async (id, method, args) => {
      if (method === 'vault_count') return 2;
      if (method === 'stream_count') return 1;
      if (method === 'dca_count') return 0;
      if (method === 'get_vault') {
        const id = args[0];
        return { status: id === 1 ? 0 : 1 };
      }
      if (method === 'get_stream') return { status: 0 };
      return null;
    });

    const clients = {
      vault: { client, contractId: 'C...' },
      stream: { client, contractId: 'C...' },
      dca: { client, contractId: 'C...' },
    };

    const app = express();
    app.use('/api/stats', createStatsRouter(clients));

    const res = await request(app).get('/api/stats');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.vaults.total, 2);
    assert.strictEqual(res.body.vaults.active, 1);
    assert.strictEqual(res.body.vaults.released, 1);
  });
});
