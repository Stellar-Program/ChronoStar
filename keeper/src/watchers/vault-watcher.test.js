import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { VaultWatcher } from './vault-watcher.js';

function mockReadContract(responses) {
  let i = 0;
  return mock.fn(() => Promise.resolve(responses[i++]));
}

describe('VaultWatcher', () => {
  it('triggers release for a due vault', async () => {
    const invokeContract = mock.fn();
    const client = {
      readContract: mockReadContract([100, 1, { _attributes: { status: 0, release_ledger: 100 } }]),
      invokeContract,
    };

    const watcher = new VaultWatcher(client, 'C...');
    await watcher.poll();

    assert.strictEqual(invokeContract.mock.callCount(), 1);
    assert.strictEqual(invokeContract.mock.calls[0].arguments[1], 'release');
  });

  it('skips non-due vaults', async () => {
    const invokeContract = mock.fn();
    const client = {
      readContract: mockReadContract([50, 1, { _attributes: { status: 0, release_ledger: 100 } }]),
      invokeContract,
    };

    const watcher = new VaultWatcher(client, 'C...');
    await watcher.poll();

    assert.strictEqual(invokeContract.mock.callCount(), 0);
  });

  it('skips non-active vaults', async () => {
    const invokeContract = mock.fn();
    const client = {
      readContract: mockReadContract([100, 1, { _attributes: { status: 1, release_ledger: 50 } }]),
      invokeContract,
    };

    const watcher = new VaultWatcher(client, 'C...');
    await watcher.poll();

    assert.strictEqual(invokeContract.mock.callCount(), 0);
  });
});
