export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumiCloud - Cloud Hosting Cepat, Aman & Terpercaya",
  description:
    "Solusi cloud hosting premium dengan performa tinggi untuk website dan aplikasi Anda. Server SSD NVMe, support 24/7, SSL gratis, dan harga terjangkau.",
  keywords:
    "cloud hosting, web hosting, vps hosting, domain, ssl certificate, hosting indonesia, hosting murah, hosting cepat",
  authors: [{ name: "LumiCloud" }],
  icons: {
    icon: "favicon.ico",
  },
  openGraph: {
    title: "LumiCloud - Cloud Hosting Cepat, Aman & Terpercaya",
    description:
      "Solusi cloud hosting premium dengan performa tinggi untuk website dan aplikasi Anda.",
    url: "https://lumicloud.my.id",
    siteName: "LumiCloud",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
