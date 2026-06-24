'use client';

import { useWallet } from '@/lib/store';

export function ConnectButton() {
  const { address, isConnected, connect, disconnect } = useWallet();

  const shortAddr = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : '';

  if (isConnected) {
    return (
      <button
        onClick={disconnect}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-accent bg-bg-card hover:bg-bg-elevated transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-accent-green" />
        <span className="text-sm text-text-primary font-mono">{shortAddr}</span>
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-4 py-2 rounded-lg bg-accent-blue text-white font-medium hover:opacity-90 transition-opacity"
    >
      Connect Wallet
    </button>
  );
}
