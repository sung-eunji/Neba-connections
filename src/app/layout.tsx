import type { Metadata } from 'next';
import { Anton, Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
});

const montserrat = Montserrat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'Neba. - Connecting Fashion Possibilities to Markets Worldwide',
  description: 'Neba. - Connecting Fashion Possibilities to Markets Worldwide',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${montserrat.variable} ${openSans.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
