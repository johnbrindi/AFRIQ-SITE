import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import TopBar from '@/components/portal/TopBar';

export const metadata: Metadata = {
  title: 'AFRIQ University Portal',
  description: 'Apply to Cameroon State Universities with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <TopBar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
