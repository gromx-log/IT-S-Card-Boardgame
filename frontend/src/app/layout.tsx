import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IT-S Card — Digital Kartu Pertanyaan",
  description:
    "Aplikasi pendamping kartu pertanyaan fisik boardgame IT-S (Information Technology Sprint). Countdown 20 detik, multi tingkat kesulitan, dan sistem Rebound.",
  applicationName: "IT-S Card",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IT-S Card",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#06040e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased selection:bg-purple-600/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
