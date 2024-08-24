import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';  // Make sure Tailwind is included in globals.css

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solana Polling App',  // Updated title to reflect your project
  description: 'A decentralized polling application built on Solana.',  // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>  {/* Apply Tailwind background color */}
        {children}
      </body>
    </html>
  );
}
