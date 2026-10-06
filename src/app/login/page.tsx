"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // If it was the admin secret key, send them to /admin unless another redirect was specified
        if (data.role === "ADMIN"){ 
          window.location.href = "/admin";
    return;
        } else {
          router.push(redirectUrl);
        }
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Login failed.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-7 sm:p-9 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-xs text-slate-500">Sign in to track deliveries and access orders.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <span>{loading ? "Authenticating..." : "Sign In"}</span>
          <ArrowRight size={14} />
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>Don&apos;t have an account yet? </span>
        <Link href="/catalog" className="text-blue-600 font-semibold hover:underline">
          Continue as Guest
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading sign in...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}