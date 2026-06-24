import * as StellarSdk from '@stellar/stellar-sdk';

const RPC_URL = process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = process.env.STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';

const server = new StellarSdk.SorobanRpc.Server(RPC_URL);
const dummyKeypair = StellarSdk.Keypair.random();

async function checkContract(contractId, name) {
  try {
    const account = new StellarSdk.Account(dummyKeypair.publicKey(), '0');
    const contract = new StellarSdk.Contract(contractId);

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('current_ledger'))
      .setTimeout(30)
      .build();

    const result = await server.simulateTransaction(tx);

    if (StellarSdk.SorobanRpc.Api.isSimulationError(result)) {
      console.log(`❌ ${name} (${contractId}): Simulation error`);
      return false;
    }

    const ledger = StellarSdk.scValToNative(result.result.retval);
    console.log(`✅ ${name} (${contractId}): Live, current ledger ${ledger}`);
    return true;
  } catch (err) {
    console.log(`❌ ${name} (${contractId}): ${err.message}`);
    return false;
  }
}

async function main() {
  const vaultId = process.env.VAULT_CONTRACT_ID;
  const streamId = process.env.STREAM_CONTRACT_ID;
  const dcaId = process.env.DCA_CONTRACT_ID;

  if (!vaultId || !streamId || !dcaId) {
    console.error('Set VAULT_CONTRACT_ID, STREAM_CONTRACT_ID, and DCA_CONTRACT_ID env vars');
    process.exit(1);
  }

  const results = await Promise.all([
    checkContract(vaultId, 'ScheduleVault'),
    checkContract(streamId, 'RecurringStream'),
    checkContract(dcaId, 'DCAPolicy'),
  ]);

  const allOk = results.every(Boolean);
  if (allOk) {
    console.log('\n✅ All contracts are live and responding');
  } else {
    console.log('\n❌ Some contracts are not responding');
    process.exit(1);
  }
}

main().catch(console.error);
