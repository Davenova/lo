import type { Metadata } from "next";
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Buttons from './buttons'; // Import the Buttons component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Telegram Mini App',
  description: 'A simple Telegram mini app using Next.js and Prisma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <Buttons /> {/* Using the Buttons component */}
        {children}
      </body>
    </html>
  );
}
