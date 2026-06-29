import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
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
        <Providers>
          <TopBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
