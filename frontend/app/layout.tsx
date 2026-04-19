import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vantion | Pre-College Program Match",
  description: "An AI-guided pre-college program matcher for high school students planning their college path.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-ink">{children}</body>
    </html>
  );
}
