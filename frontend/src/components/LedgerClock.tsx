'use client';

import { useState, useEffect } from 'react';

export function LedgerClock() {
  const [ledger, setLedger] = useState(0);
  const [time, setTime] = useState('');

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await fetch('https://soroban-testnet.stellar.org/rpc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getLatestLedger',
          }),
        });
        const data = await res.json();
        if (data.result?.sequence) {
          setLedger(data.result.sequence);
        }
      } catch {
        // fallback
      }
    };

    fetchLedger();
    const interval = setInterval(fetchLedger, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-3 text-sm text-text-muted">
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
        Ledger {ledger}
      </span>
      <span>{time}</span>
    </div>
  );
}
