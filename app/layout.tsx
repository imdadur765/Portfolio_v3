import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Imdad — Building Beyond Possible',
  description: 'Personal portfolio of Imdad — useful products, emerging tech, and public builds.',
};

export const viewport: Viewport = {
  themeColor: '#0d1520',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full bg-[#0d1520]">
      <body className="h-full w-full bg-[#0d1520] text-[#0d1520] antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
