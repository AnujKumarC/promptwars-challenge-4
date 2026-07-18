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
  description: "AI-powered tournament command center and fan guide for the FIFA World Cup 2026. Custom spatial pathfinding, computer vision surveillance flows, and multilingual Gemini voice assistants.",
  keywords: ["FIFA", "World Cup 2026", "Smart Stadium", "Generative AI", "Tournament Operations", "Pathfinding", "Security Surveillance", "Gemini API"],
  authors: [{ name: "Anuj Kumar Choudhary" }],
  robots: "index, follow",
  openGraph: {
    title: "FIFA Nexus AI - Smart Stadium Platform",
    description: "Generative AI-powered tournament command center and fan experience guide.",
    type: "website",
    locale: "en_US",
  }
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

