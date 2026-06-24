import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { StreamWatcher } from './stream-watcher.js';

function mockReadContract(responses) {
  let i = 0;
  return mock.fn(() => Promise.resolve(responses[i++]));
}

describe('StreamWatcher', () => {
  it('ticks a completed stream', async () => {
    const invokeContract = mock.fn();
    const client = {
      readContract: mockReadContract([
        1,
        { _attributes: { status: 0, end_ledger: 100 } },
        200,
      ]),
      invokeContract,
    };

    const watcher = new StreamWatcher(client, 'C...');
    await watcher.poll();

    assert.strictEqual(invokeContract.mock.callCount(), 1);
    assert.strictEqual(invokeContract.mock.calls[0].arguments[1], 'tick');
  });

  it('skips non-completed streams', async () => {
    const invokeContract = mock.fn();
    const client = {
      readContract: mockReadContract([
        1,
        { _attributes: { status: 0, end_ledger: 300 } },
        200,
      ]),
      invokeContract,
    };

    const watcher = new StreamWatcher(client, 'C...');
    await watcher.poll();

    assert.strictEqual(invokeContract.mock.callCount(), 0);
  });
});
