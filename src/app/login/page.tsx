"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/catalog";

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isRegister) {
        // Sign Up Flow
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || "Failed to create account.");
          return;
        }

        // Auto sign-in immediately after registration
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (loginRes.ok) {
          router.push(redirectUrl);
          router.refresh();
        } else {
          setIsRegister(false);
          setErrorMsg("Account created! Please sign in with your credentials.");
        }
      } else {
        // Sign In Flow
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          if (data.role === "ADMIN") {
            window.location.href = "/admin";
            return;
          }
          router.push(redirectUrl);
          router.refresh();
        } else {
          setErrorMsg(data.error || "Invalid email or password.");
        }
      }
    } catch {
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block text-2xl font-black text-slate-900 tracking-tight">
          Realms <span className="text-blue-600">Gifts</span>
        </Link>
        <h2 className="mt-3 text-lg font-bold text-slate-800">
          {isRegister ? "Create your account" : "Sign in to your account"}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {isRegister
            ? "Save your addresses and track overseas deliveries live."
            : "Access your saved parcels, order history, and live tracking."}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegister && (
              <div>
                <label htmlFor="auth-name" className="block font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    id="auth-name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={15} />
                </div>
                <input
                  id="auth-email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={15} />
                </div>
                <input
                  id="auth-password"
                  required
                  type="password"
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isRegister ? "At least 6 characters" : "••••••••"}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={15} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? "Create Account" : "Sign In"}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Registration */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              {isRegister ? "Already have an account?" : "New to Realms Gifts?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMsg("");
                }}
                className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {isRegister ? "Sign In" : "Sign Up Here"}
                {!isRegister && <Sparkles size={12} />}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}