import Link from 'next/link';
import { ConnectButton } from './ConnectButton';
import { LedgerClock } from './LedgerClock';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading text-xl font-bold text-text-primary">
            ChronoStar
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-text-muted">
            <Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
            <Link href="/explorer" className="hover:text-text-primary transition-colors">Explorer</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LedgerClock />
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
