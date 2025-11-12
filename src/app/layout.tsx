import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import MaterialSymbolsLoader from "./components/MaterialSymbolsLoader";
import ThemeRegistry from "./components/ThemeRegistry";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Clinic - EMR System",
  description: "Electronic Medical Records System for Smart Clinic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable}`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <MaterialSymbolsLoader />
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
