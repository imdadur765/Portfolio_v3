import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased"
    >
      <body className="min-h-full h-full bg-[#050a18] text-white overflow-x-hidden selection:bg-[#e62429] selection:text-white">
        {children}
      </body>
    </html>
  );
}
