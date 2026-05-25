import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { getSettings } from "@/app/actions/settings";
import ThemeProvider from "@/components/providers/ThemeProvider";

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

function hexToHslTuple(hex: string) {
  const normalized = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h: Math.round(h * 10) / 10,
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const accentColor = settings?.accentColor; // Only override if explicitly set in DB
  const accentHsl = accentColor ? hexToHslTuple(accentColor) : null;

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
        style={{ 
          ...(accentHsl
            ? {
                "--primary": `${accentHsl.h} ${accentHsl.s}% ${accentHsl.l}%`,
                "--ring": `${accentHsl.h} ${accentHsl.s}% ${accentHsl.l}%`,
              }
            : {}),
        } as React.CSSProperties}
      >
        <ThemeProvider>
          <NextAuthProvider>
            {children}
            <Toaster richColors position="top-center" />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
