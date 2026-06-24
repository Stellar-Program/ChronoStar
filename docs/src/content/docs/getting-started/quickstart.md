---
title: Quickstart
description: Deploy contracts, run the keeper, and open the dashboard.
---

## Prerequisites

- Node.js v22+
- Rust 1.79+ with `wasm32-unknown-unknown` target
- Stellar Testnet account with some tokens
- Freighter wallet (browser extension)

## 1. Deploy Contracts

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release

# Install Soroban CLI
cargo install --locked soroban-cli

# Deploy each contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/schedule_vault.wasm \
  --source <SECRET> \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

Note the returned contract IDs. Set them in `.env` files.

## 2. Configure Environment

```bash
# Keeper
cd keeper
cp .env.example .env
# Edit .env with your secret key and contract IDs

# Backend
cd backend
cp .env.example .env
# Edit .env with contract IDs
```

## 3. Run the Keeper

```bash
cd keeper
npm install
npm start
```

The keeper will poll every 30 seconds and trigger on-chain actions.

## 4. Start the Backend

```bash
cd backend
npm install
npm start
```

## 5. Open the Dashboard

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` and connect your Freighter wallet.

## 6. Create a Schedule

1. Connect your wallet
2. Navigate to **Dashboard**
3. Click **New Vault** (or Stream / DCA)
4. Fill in the form and submit
5. Watch the keeper execute when the time comes
