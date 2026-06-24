---
title: Overview
description: What is ChronoStar and how it works.
---

ChronoStar brings **scheduled and recurring payments** to Stellar's Soroban platform. It fills a gap in the Stellar ecosystem: there is no native way to lock funds and release them at a future time, stream payments continuously, or automate recurring token swaps.

ChronoStar solves this with three smart contracts and an off-chain keeper bot:

| Contract | Purpose |
|---|---|
| **ScheduleVault** | Lock funds, release them at a specific future ledger |
| **RecurringStream** | Stream tokens continuously, let recipients claim accrued amounts |
| **DCAPolicy** | Commit a budget and auto-execute fixed-size swaps on a schedule |

## Architecture

```
User → Frontend (Next.js) → Backend API (Express) → Soroban RPC → Stellar Testnet
                               ↕
                          Keeper Bot (Node.js) → polls → calls release/tick/execute_swap
```

- **Frontend**: Next.js 14 dashboard for creating, viewing, and managing schedules
- **Backend**: Express REST API that reads contract state via Soroban `simulateTransaction`
- **Keeper**: Always-on Node.js service that monitors active schedules and triggers on-chain execution
- **Contracts**: Rust/Soroban smart contracts deployed on Stellar Testnet

## Key Concepts

- **Ledger**: Stellar's unit of time (~5 seconds). All schedules are denominated in ledgers.
- **Keeper**: An automated bot that polls contracts and calls release/tick/execute when conditions are met.
- **Soroban**: Stellar's smart contract platform. Contracts are written in Rust and compiled to WASM.
