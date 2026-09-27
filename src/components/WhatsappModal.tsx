"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppModal() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2340000000000";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent("Hello! I need support with Realms Gift.")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-26 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={20} />
      <span className="text-sm font-semibold">Support</span>
    </a>
  );
}
