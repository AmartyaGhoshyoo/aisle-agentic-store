import type { Metadata, Viewport } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import Agent from "./components/Agent";

const display = Syne({ subsets: ["latin"], variable: "--font-display-face", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body-face", display: "swap" });

export const metadata: Metadata = {
  title: "Aisle — the store that shops with you",
  description: "An agentic shopping store: tell it what you need, it finds, compares, sizes and carts it — you press pay. By Zovak.",
};

export const viewport: Viewport = { themeColor: "#fdf2f8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Agent />
      </body>
    </html>
  );
}
