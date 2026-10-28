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
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#0d1117] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
