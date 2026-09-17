"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function DeliveryBanner() {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(14, 0, 0, 0); // 2:00 PM cutoff

      if (now > cutoff) {
        setTimeLeft("Cutoff reached. Eligible for tomorrow");
        return;
      }

      const diff = cutoff.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s remaining`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-blue-600 text-white text-xs font-medium py-2 px-4 flex items-center justify-center gap-2">
      <Clock size={14} />
      <span>Order within <strong>{timeLeft}</strong> for Same-Day Delivery!</span>
    </div>
  );
}