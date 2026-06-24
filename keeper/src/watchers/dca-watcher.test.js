import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { DCAWatcher } from './dca-watcher.js';

function mockReadContract(responses) {
  let i = 0;
  return mock.fn(() => Promise.resolve(responses[i++]));
}

describe('DCAWatcher', () => {
  it('executes a due DCA swap', async () => {
    const invokeContract = mock.fn();
    const client = {
      readContract: mockReadContract([
        1,
        { _attributes: { status: 0, next_execution_ledger: 100 } },
        200,
      ]),
      invokeContract,
    };

    const watcher = new DCAWatcher(client, 'C...');
    await watcher.poll();

    assert.strictEqual(invokeContract.mock.callCount(), 1);
    assert.strictEqual(invokeContract.mock.calls[0].arguments[1], 'execute_swap');
  });

  it('skips non-due DCA', async () => {
    const invokeContract = mock.fn();
    const client = {
      readContract: mockReadContract([
        1,
        { _attributes: { status: 0, next_execution_ledger: 300 } },
        200,
      ]),
      invokeContract,
    };

    const watcher = new DCAWatcher(client, 'C...');
    await watcher.poll();

    assert.strictEqual(invokeContract.mock.callCount(), 0);
  });
});
