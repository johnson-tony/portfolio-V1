import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { getSettings } from "@/app/actions/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings?.siteTitle || "Premium SaaS Portfolio",
    description: settings?.heroSubheading || "A modern, high-end developer portfolio inspired by premium SaaS platforms.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const accentColor = settings?.accentColor || "#F97316";

  return (
    <html lang="en" className="dark scroll-smooth">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A0A0B] text-white selection:bg-primary/30 selection:text-primary`}
        style={{ 
          "--primary": accentColor,
          "--ring": accentColor,
        } as React.CSSProperties}
      >
        <NextAuthProvider>
          {children}
          <Toaster richColors position="top-center" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
