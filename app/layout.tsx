import type { Metadata } from "next";
import { Albert_Sans, Fragment_Mono } from "next/font/google";
import "./globals.css";

const albertSans = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin"],
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Imdad — Portfolio",
  description: "Building Beyond Possible. Personal portfolio of Imdad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${albertSans.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="min-h-full h-full bg-[#e8eef3] text-[#11161d] overflow-x-hidden selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
