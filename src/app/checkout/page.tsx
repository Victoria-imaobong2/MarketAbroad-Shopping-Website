"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const LOCATIONS = [
  { id: "lagos-mainland", name: "Lagos Mainland", fee: 2500, sameDayAvailable: true },
  { id: "lagos-island", name: "Lagos Island / Lekki", fee: 3500, sameDayAvailable: true },
  { id: "abuja", name: "Abuja (FCT)", fee: 4500, sameDayAvailable: false },
  { id: "ph", name: "Port Harcourt", fee: 4500, sameDayAvailable: false },
  { id: "owerri", name: "Owerri", fee: 4000, sameDayAvailable: false },
];

export default function CheckoutPage() {
  const { items } = useCartStore();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].id);
  const [isSameDay, setIsSameDay] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const currentLocation = LOCATIONS.find((loc) => loc.id === selectedLocation) || LOCATIONS[0];
  const sameDaySurcharge = isSameDay && currentLocation.sameDayAvailable ? 2000 : 0;
  const deliveryFee = currentLocation.fee + sameDaySurcharge;
  const grandTotal = subtotal + deliveryFee;

  const handlePayment = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          address,
          location: currentLocation.name,
          amount: grandTotal,
          isSameDay,
          items,
        }),
      });

      const data = await res.json();
      if (data.authorization_url) {
        // window.location.assign avoids React Compiler immutability lint errors
        window.location.assign(data.authorization_url);
      } else {
        alert(data.error || "Payment failed to initiate.");
      }
    } catch {
      alert("Something went wrong. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">No items to checkout</h2>
        <Link href="/catalog" className="text-blue-600 underline text-sm">
          Return to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6">
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 sm:p-7 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Victoria Solomon"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="text-xs font-semibold text-slate-700 block mb-1">
                Select Delivery Destination
              </label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setIsSameDay(false);
                }}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-white"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} (₦{loc.fee.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="address" className="text-xs font-semibold text-slate-700 block mb-1">
                Street Address
              </label>
              <textarea
                id="address"
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House number, street name, landmarks"
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600"
              />
            </div>

            <div className={`p-4 rounded-lg border transition ${
              currentLocation.sameDayAvailable
                ? "border-blue-200 bg-blue-50/60"
                : "border-slate-200 bg-slate-50 opacity-60"
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!currentLocation.sameDayAvailable}
                  checked={isSameDay && currentLocation.sameDayAvailable}
                  onChange={(e) => setIsSameDay(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs block">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Truck size={14} className="text-blue-600" />
                    Same-Day Express Delivery (+₦2,000)
                  </span>
                  <span className="text-slate-500 mt-0.5 block">
                    {currentLocation.sameDayAvailable
                      ? "Guaranteed delivery today if ordered before 2:00 PM cutoff."
                      : "Same-day delivery is not supported for this region."}
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-5 sm:p-7 rounded-xl border border-slate-200 shadow-sm space-y-4 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between items-center text-xs">
                  <div className="truncate pr-2">
                    <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                    <span className="text-slate-500">{item.color} | {item.size} × {item.quantity}</span>
                  </div>
                  <span className="font-medium text-slate-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery ({currentLocation.name})</span>
                <span className="font-medium text-slate-900">₦{currentLocation.fee.toLocaleString()}</span>
              </div>
              {isSameDay && (
                <div className="flex justify-between text-blue-600">
                  <span>Same-Day Surcharge</span>
                  <span className="font-medium">+₦2,000</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Grand Total</span>
                <span className="text-blue-600">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3.5 rounded-lg text-sm transition shadow-sm"
            >
              {loading ? "Connecting to Paystack..." : `Pay ₦${grandTotal.toLocaleString()}`}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs pt-1">
              <ShieldCheck size={14} />
              <span>Secured by Paystack Standard Encryption</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}