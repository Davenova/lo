import type { Metadata } from "next";
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

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
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
          body {
            font-family: 'Fredoka One', cursive;
          }
          .glow-blue-on-hover:hover {
            box-shadow: 0 0 15px 5px rgba(0, 0, 255, 0.5);
            transform: scale(1.05);
          }
          .glow-green-on-hover:hover {
            box-shadow: 0 0 15px 5px rgba(0, 255, 0, 0.5);
            transform: scale(1.05);
          }
          .glow-pink-on-hover:hover {
            box-shadow: 0 0 15px 5px rgba(255, 20, 147, 0.5);
            transform: scale(1.05);
          }
        `}} />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
