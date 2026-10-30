import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import Agent from "./components/Agent";

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display-face", display: "swap" });
const body = Jost({ subsets: ["latin"], variable: "--font-body-face", display: "swap" });

export const metadata: Metadata = {
  title: "Aisle — the store that shops with you",
  description: "An agentic shopping store: tell it what you need, it finds, compares, sizes and carts it — you press pay. By Zovak.",
};

export const viewport: Viewport = { themeColor: "#fdf2f8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Agent />
      </body>
    </html>
  );
}
