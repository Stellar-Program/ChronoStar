import type { Metadata } from 'next';
import '@/styles/globals.css';
import { WalletProvider } from '@/lib/store';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ChronoStar — Scheduled Payments on Stellar',
  description: 'Time-based payment primitives for the Stellar ecosystem: ScheduleVault, RecurringStream, DCAPolicy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <WalletProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
