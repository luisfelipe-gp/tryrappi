import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Bots WhatsApp",
  description: "SaaS de logística automatizada"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
