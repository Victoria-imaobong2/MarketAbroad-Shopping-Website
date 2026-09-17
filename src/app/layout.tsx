import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import DeliveryBanner from "@/components/DeliveryBanner";
import WhatsAppModal from "@/components/WhatsappModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarketAbroad | Same Day Delivery Marketplace",
  description: "Browse products and order with proof-of-delivery guarantee.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <DeliveryBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <WhatsAppModal />
      </body>
    </html>
  );
}