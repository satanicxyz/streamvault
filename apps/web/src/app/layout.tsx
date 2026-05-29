import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/providers';
import { Navbar } from '@/components/layout/navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'StreamVault - Premium Streaming Platform',
  description: 'Watch movies, series, micro dramas, and exclusive content. Your premium streaming destination.',
  keywords: ['streaming', 'movies', 'series', 'micro drama', 'vertical drama', 'watch online'],
  openGraph: {
    title: 'StreamVault - Premium Streaming Platform',
    description: 'Watch movies, series, micro dramas, and exclusive content.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
