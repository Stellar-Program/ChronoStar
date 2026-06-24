#!/bin/bash
set -euo pipefail

NETWORK="${1:-testnet}"
echo "Deploying ChronoStar contracts to $NETWORK..."

cd contract

echo "Building all contracts..."
stellar contract build

echo "Deploying ScheduleVault..."
VAULT_ID=$(stellar contract deploy \
  --wasm schedule-vault/target/wasm32-unknown-unknown/release/schedule_vault.wasm \
  --source deployer \
  --network "$NETWORK")
echo "VAULT_CONTRACT_ID=$VAULT_ID"

echo "Deploying RecurringStream..."
STREAM_ID=$(stellar contract deploy \
  --wasm recurring-stream/target/wasm32-unknown-unknown/release/recurring_stream.wasm \
  --source deployer \
  --network "$NETWORK")
echo "STREAM_CONTRACT_ID=$STREAM_ID"

echo "Deploying DCAPolicy..."
DCA_ID=$(stellar contract deploy \
  --wasm dca-policy/target/wasm32-unknown-unknown/release/dca_policy.wasm \
  --source deployer \
  --network "$NETWORK")
echo "DCA_CONTRACT_ID=$DCA_ID"

echo ""
echo "=== Deployment Complete ==="
echo "VAULT_CONTRACT_ID=$VAULT_ID"
echo "STREAM_CONTRACT_ID=$STREAM_ID"
echo "DCA_CONTRACT_ID=$DCA_ID"
