import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import request from 'supertest';
import { createSchedulesRouter } from './schedules.js';

function mockClient() {
  return {
    readContract: mock.fn(),
    scvU64: (v) => v,
    scvAddress: (a) => a,
  };
}

describe('GET /api/schedules/:address', () => {
  it('returns vaults for an address', async () => {
    const client = mockClient();
    client.readContract.mock.mockImplementation(async (id, method, args) => {
      if (method === 'get_vaults_by_owner') {
        return [1, 2];
      }
      if (method === 'get_vault') {
        const id = args[0];
        return { id, owner: 'G...', amount: id === 1 ? 1000 : 2000, status: 0 };
      }
      return null;
    });

    const app = express();
    app.use('/api/schedules', createSchedulesRouter(client, 'C...'));

    const res = await request(app).get('/api/schedules/G...');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[0].amount, 1000);
  });

  it('returns empty array when no vaults', async () => {
    const client = mockClient();
    client.readContract.mock.mockImplementation(() => null);

    const app = express();
    app.use('/api/schedules', createSchedulesRouter(client, 'C...'));

    const res = await request(app).get('/api/schedules/G...');
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body, []);
  });
});
