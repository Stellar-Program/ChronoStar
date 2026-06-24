export const config = {
  vaultContractId: process.env.VAULT_CONTRACT_ID || '',
  streamContractId: process.env.STREAM_CONTRACT_ID || '',
  dcaContractId: process.env.DCA_CONTRACT_ID || '',
  rpcUrl: process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
  networkPassphrase: process.env.STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  port: parseInt(process.env.PORT || '3001', 10),
};
