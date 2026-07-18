import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppStateProvider } from "@/context/AppStateContext";
import LayoutWrapper from "@/components/ui/LayoutWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FIFA Nexus AI - Smart Stadium & Tournament Operations Platform",
  description: "AI-powered tournament command center and fan guide for the FIFA World Cup 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppStateProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppStateProvider>
      </body>
    </html>
  );
}

