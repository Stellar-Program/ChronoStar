import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import request from 'supertest';
import { createEventsRouter } from './events.js';

describe('GET /api/events', () => {
  it('returns upcoming events sorted by remaining ledgers', async () => {
    const client = {
      readContract: mock.fn(),
      scvU64: (v) => v,
    };

    client.readContract.mock.mockImplementation(async (id, method, args) => {
      if (method === 'vault_count') return 1;
      if (method === 'stream_count') return 0;
      if (method === 'dca_count') return 0;
      if (method === 'current_ledger') return 100;
      if (method === 'get_vault') return { _attributes: { status: 0, release_ledger: 150 } };
      return null;
    });

    const clients = {
      vault: { client, contractId: 'C...' },
      stream: { client, contractId: 'C...' },
      dca: { client, contractId: 'C...' },
    };

    const app = express();
    app.use('/api/events', createEventsRouter(clients));

    const res = await request(app).get('/api/events?limit=10');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].remainingLedgers, 50);
  });
});
