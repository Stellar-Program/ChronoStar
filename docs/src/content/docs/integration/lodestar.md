---
title: Lodestar Integration
description: Connect ChronoStar with Lodestar for agent auto-pay.
---

## Overview

[Lodestar](https://github.com/Stellar-Ecosystem/lodestar) is the discovery and credit scoring layer for AI agents on Stellar. ChronoStar integrates with Lodestar to provide **auto-pay subscriptions** for agents.

## Agent Auto-Pay Pattern

AI agents registered in Lodestar can create ChronoStar schedules to pay for recurring services:

```
Agent → Lodestar (credit check) → ChronoStar (create stream) → Provider (receives payments)
```

### 1. Create a Stream

The agent calls `RecurringStream.create_stream()` with the service provider as recipient:

```rust
let stream_id = RecurringStream::create_stream(
    env,
    agent_address,
    service_provider_address,
    usdc_token_address,
    total_amount,
    duration_ledgers,
    label,
);
```

### 2. Store the Stream ID

The agent stores the `stream_id` in its local state for future reference.

### 3. Verify Subscription

The service provider can verify an active subscription by reading the stream:

```rust
let stream = RecurringStream::get_stream(env, stream_id);

if stream.status == Active && stream.remaining_budget > 0 {
    // Service is subscribed
}
```

### 4. Top Up

Before the stream runs out, the agent can top up by creating a new stream. The provider checks that at least one active stream exists before each service call.

## Example: Agent Subscription Service

```javascript
// Provider checks subscription before serving a request
async function checkSubscription(agentAddress) {
  const streams = await api.getStreams(agentAddress);
  const activeStream = streams.find(
    s => s.status === 'Active' && Number(s.remaining) > 0
  );
  return !!activeStream;
}
```

## Contract Requirements

- Agents must hold USDC (or the chosen token) to fund streams
- The keeper bot will automatically tick completed streams
- Canceled streams return remaining funds to the agent
