# ChronoStar Contract Deployment

## Prerequisites

```bash
rustup target add wasm32-unknown-unknown
cargo install --locked stellar-cli --features opt
```

## Build All Contracts

```bash
cd contract
stellar contract build
```

## Deploy to Testnet

### 1. Generate and fund deployer keypair

```bash
stellar keys generate deployer --network testnet --fund
```

### 2. Deploy ScheduleVault

```bash
stellar contract deploy \
  --wasm schedule-vault/target/wasm32-unknown-unknown/release/schedule_vault.wasm \
  --source deployer \
  --network testnet
```
→ Copy printed contract ID → `VAULT_CONTRACT_ID`

### 3. Deploy RecurringStream

```bash
stellar contract deploy \
  --wasm recurring-stream/target/wasm32-unknown-unknown/release/recurring_stream.wasm \
  --source deployer \
  --network testnet
```
→ Copy printed contract ID → `STREAM_CONTRACT_ID`

### 4. Deploy DCAPolicy

```bash
stellar contract deploy \
  --wasm dca-policy/target/wasm32-unknown-unknown/release/dca_policy.wasm \
  --source deployer \
  --network testnet
```
→ Copy printed contract ID → `DCA_CONTRACT_ID`

## Fund Keeper Wallet

```bash
stellar keys generate keeper --network testnet --fund
stellar keys show keeper
```
Copy secret key → `KEEPER_SECRET`

## Deployed Contract Addresses (Testnet)

| Contract | Address |
|---|---|
| ScheduleVault | `C...` |
| RecurringStream | `C...` |
| DCAPolicy | `C...` |

> **Mainnet**: Replace `--network testnet` with `--network mainnet` and update env vars.
