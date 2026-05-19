import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium SaaS Portfolio | Full-Stack Developer",
  description: "A modern, high-end developer portfolio inspired by premium SaaS platforms.",
};

import NextAuthProvider from "@/components/providers/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A0A0B] text-white selection:bg-primary/30 selection:text-primary`}>
        <NextAuthProvider>
          {children}
          <Toaster richColors position="top-center" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
