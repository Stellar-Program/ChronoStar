import Link from 'next/link';
import { api } from '@/lib/api';
import type { Stats } from '@/types';

async function getStats(): Promise<Stats | null> {
  try {
    return await api.getStats();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="space-y-16">
      <section className="text-center pt-16 pb-8">
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-text-primary leading-tight">
          Time-Based Payments<br />
          <span className="text-accent-blue">on Stellar</span>
        </h1>
        <p className="mt-6 text-lg text-text-muted max-w-2xl mx-auto">
          Lock, stream, or DCA your tokens with Soroban smart contracts.
          A keeper bot handles execution — you just set the schedule.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-accent-blue text-white font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <Link
            href="/explorer"
            className="px-6 py-3 rounded-lg border border-border-accent text-text-primary font-medium hover:bg-bg-card transition-colors"
          >
            Explore
          </Link>
        </div>
      </section>

      {stats && (
        <section className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <StatCard label="Vaults" value={stats.vaults.total} color="text-accent-blue" />
          <StatCard label="Streams" value={stats.streams.total} color="text-accent-green" />
          <StatCard label="DCA Policies" value={stats.dca.total} color="text-accent-orange" />
        </section>
      )}

      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          title="ScheduleVault"
          description="Lock funds and release them at a specific future ledger. Perfect for vesting, escrow, and deferred payroll."
          href="/vault/new"
          color="border-accent-blue"
        />
        <FeatureCard
          title="RecurringStream"
          description="Stream tokens continuously. Recipients claim accrued amounts at any time — like a salary or subscription."
          href="/stream/new"
          color="border-accent-green"
        />
        <FeatureCard
          title="DCAPolicy"
          description="Commit a budget and auto-execute fixed-size swaps on a recurring schedule. Dollar-cost average into any asset."
          href="/dca/new"
          color="border-accent-orange"
        />
      </section>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center p-4 rounded-lg border border-border bg-bg-card">
      <div className={`text-2xl font-bold font-heading ${color}`}>{value}</div>
      <div className="text-sm text-text-muted mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ title, description, href, color }: { title: string; description: string; href: string; color: string }) {
  return (
    <Link href={href} className={`block p-6 rounded-lg border ${color} bg-bg-card hover:bg-bg-elevated transition-colors`}>
      <h3 className="text-lg font-heading font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
    </Link>
  );
}
