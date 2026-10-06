"use client";

import { useState, useEffect, useMemo, type SubmitEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { ALL_COUNTRIES, type CountryOption } from "@/lib/countries";
import { CURRENCIES, type CurrencyCode, formatPrice, convertAmount } from "@/lib/currencies";
import { calculateOrderFees } from "@/lib/fees";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  images?: string[];
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Currency & Location States
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("GB");
  const [isExpress, setIsExpress] = useState(false);

  // Recipient Information
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine: "",
    stateProvince: "",
    postalCode: "",
  });

  // Client hydration without synchronous effect re-render violation
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem("cart-storage");
        if (stored) {
          const parsed = JSON.parse(stored);
          setCartItems(parsed.state?.cart ?? []);
        }
      } catch (err) {
        console.error("Failed to load cart items:", err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const selectedCountry = useMemo<CountryOption | undefined>(() => {
    return ALL_COUNTRIES.find((c: CountryOption) => c.code === selectedCountryCode);
  }, [selectedCountryCode]);

  const itemsSubtotalNGN = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const fees = useMemo(() => {
    return calculateOrderFees({
      itemsSubtotalNGN,
      itemCount: totalItemCount,
      country: selectedCountry,
      isExpress,
      displayCurrency: currency,
    });
  }, [itemsSubtotalNGN, totalItemCount, selectedCountry, isExpress, currency]);

  const handlePaystackCheckout = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const totalAmountInNGN = convertAmount(fees.total / CURRENCIES[currency].rateFromUSD, "NGN");
      const amountInKobo = Math.round(totalAmountInNGN * 100);

      const payload = {
        email: formData.email,
        amount: amountInKobo,
        currency: "NGN",
        metadata: {
          customerName: formData.fullName,
          phone: formData.phone,
          shippingAddress: {
            line: formData.addressLine,
            state: formData.stateProvince,
            country: selectedCountry?.name,
            postalCode: formData.postalCode,
          },
          selectedDisplayCurrency: currency,
          displayTotal: formatPrice(fees.total, currency),
          items: cartItems.map((item) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            unitPriceNGN: item.price,
          })),
        },
      };

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.authorization_url) {
        localStorage.removeItem("cart-storage");
        window.location.href = data.authorization_url;
      } else {
        alert(data.error || "Unable to start checkout. Check network or Paystack key.");
      }
    } catch (err) {
      console.error(err);
      alert("Error initializing payment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={14} /> Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900 mb-1">Worldwide Shipping Details</h1>
            <p className="text-xs text-slate-500 mb-6">Enter recipient details for gift export and customs clearance.</p>

            <form onSubmit={handlePaystackCheckout} id="checkout-form" className="space-y-4 text-xs">
              <div>
                <label htmlFor="fullName" className="block font-semibold text-slate-700 mb-1">
                  Recipient Full Name
                </label>
                <input
                  id="fullName"
                  required
                  type="text"
                  placeholder="e.g. Adanna Smith"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block font-semibold text-slate-700 mb-1">
                    Email Address (for order tracking)
                  </label>
                  <input
                    id="email"
                    required
                    type="email"
                    placeholder="recipient@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-semibold text-slate-700 mb-1">
                    Phone Number (Courier SMS)
                  </label>
                  <input
                    id="phone"
                    required
                    type="tel"
                    placeholder="+44 7700 900077"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block font-semibold text-slate-700 mb-1">
                  Destination Country
                </label>
                <select
                  id="country"
                  required
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg outline-none bg-white focus:border-blue-600"
                >
                  {ALL_COUNTRIES.map((c: CountryOption) => (
                    <option key={c.code} value={c.code}>
                      {c.name} {c.sameDayAvailable ? "• (Express Available)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stateProvince" className="block font-semibold text-slate-700 mb-1">
                    State / Province / Region
                  </label>
                  <input
                    id="stateProvince"
                    required
                    type="text"
                    placeholder="e.g. Greater London, Texas, Ontario"
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block font-semibold text-slate-700 mb-1">
                    Postal / ZIP Code
                  </label>
                  <input
                    id="postalCode"
                    required
                    type="text"
                    placeholder="e.g. SW1A 1AA / 75001"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="addressLine" className="block font-semibold text-slate-700 mb-1">
                  Street Address & Apartment / Unit
                </label>
                <input
                  id="addressLine"
                  required
                  type="text"
                  placeholder="e.g. 14 Kensington Road, Flat 3B"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>

              {selectedCountry?.sameDayAvailable && (
                <div className="pt-2">
                  <label htmlFor="express-toggle" className="flex items-center gap-2.5 p-3 border border-blue-100 bg-blue-50/60 rounded-xl cursor-pointer">
                    <input
                      id="express-toggle"
                      type="checkbox"
                      checked={isExpress}
                      onChange={(e) => setIsExpress(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-xs">Priority Air Express Dispatch</p>
                      <p className="text-[11px] text-slate-500">Expedited parcel handling with next-flight out.</p>
                    </div>
                  </label>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Billing Currency</span>
                <select
                  aria-label="Select billing currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none text-blue-600"
                >
                  {Object.keys(CURRENCIES).map((code) => (
                    <option key={code} value={code}>
                      {code} ({CURRENCIES[code as CurrencyCode].symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-50 pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <span className="font-medium text-slate-800">{item.title}</span>
                      <span className="text-slate-400 block text-[10px]">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-slate-900 shrink-0">
                      {formatPrice(
                        convertAmount((item.price * item.quantity) / 1550, currency),
                        currency
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2.5 text-xs border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItemCount} items)</span>
                  <span>{formatPrice(fees.subtotal, currency)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Air Courier Shipping ({selectedCountry?.name || "Global"})</span>
                  <span>{formatPrice(fees.shippingFee, currency)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Custom Gift Packaging & Seal</span>
                  <span>{formatPrice(fees.packagingFee, currency)}</span>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Amount</span>
                  <span className="text-blue-600">{formatPrice(fees.total, currency)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={submitting || cartItems.length === 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Connecting Paystack Gateway...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} /> Pay {formatPrice(fees.total, currency)}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" /> 256-bit SSL
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-blue-600" /> DHL / FedEx Cargo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}