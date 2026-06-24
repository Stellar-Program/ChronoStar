'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useWallet } from '@/lib/store';
import { TxToast } from '@/components/TxToast';
import type { StreamEntry } from '@/types';

export default function StreamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { address } = useWallet();
  const [stream, setStream] = useState<StreamEntry | null>(null);
  const [txStatus, setTxStatus] = useState<null | 'pending' | 'success' | 'error'>(null);

  useEffect(() => {
    if (!address) return;
    api.getStreams(address).then(streams => {
      const found = streams.find(s => s.id === Number(id));
      if (found) setStream(found);
    });
  }, [address, id]);

  if (!stream) return <p className="text-text-muted text-center py-20">Loading...</p>;

  const claimed = Number(stream.claimed_amount);
  const total = Number(stream.total_amount);
  const progress = total > 0 ? (claimed / total) * 100 : 0;

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/dashboard" className="text-sm text-accent-blue hover:underline">&larr; Dashboard</Link>
      <h1 className="text-2xl font-heading font-bold text-text-primary mt-4 mb-6">Stream #{stream.id}</h1>

      <div className="space-y-3 p-4 rounded-lg border border-border bg-bg-card">
        <DetailRow label="Label" value={stream.label} />
        <DetailRow label="Recipient" value={stream.recipient} />
        <DetailRow label="Total Amount" value={stream.total_amount} />
        <DetailRow label="Claimed" value={stream.claimed_amount} />
        <DetailRow label="Progress" value={`${progress.toFixed(1)}%`} />
        <DetailRow label="End Ledger" value={String(stream.end_ledger)} />
        <DetailRow label="Status" value={stream.status} />
      </div>

      {stream.status === 'Active' && (
        <button
          onClick={() => setTxStatus('pending')}
          className="mt-6 w-full py-3 rounded-lg bg-accent-green text-white font-medium hover:opacity-90"
        >
          Claim
        </button>
      )}

      <TxToast status={txStatus} onClose={() => setTxStatus(null)} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm text-text-primary font-mono">{value}</span>
    </div>
  );
}
