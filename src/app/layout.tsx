import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import DeliveryBanner from "@/components/DeliveryBanner";
import WhatsAppModal from "@/components/WhatsappModal";
import BottomNav from "@/components/BottomNav";const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MarketAbroad | Fast Delivery Marketplace",
  description: "Express same-day and standard parcel delivery marketplace.",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
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
        <BottomNav/>
      </body>
    </html>
  );
  
}