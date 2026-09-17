import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Clock, PackageCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white py-16 sm:py-24 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-6">
            <Zap size={14} className="fill-blue-600" />
            24-Hour Guaranteed Cutoff Dispatch
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Premium Essentials Delivered <span className="text-blue-600">Without the Wait</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Order before the daily 2:00 PM cutoff for express same-day arrival or standard doorstep delivery with real-time digital proof of delivery.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/catalog"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/profile"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-8 py-3.5 rounded-xl text-sm transition text-center"
            >
              Track an Existing Order
            </Link>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">Strict 24h Cutoff</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automated delivery routing guarantees packages ordered before cutoff are packed and out for delivery same-day.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">Protected Payments</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every order is securely processed via Paystack with instant Resend automated email delivery receipts.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <PackageCheck size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">Verified Delivery (POD)</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Couriers verify hand-off with digital signature capture and drop-off photo proof directly to your order log.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}