"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { apiService } from "@/services/api";

export default function MerchantLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.login({ email, password });
      if (data && (data.access_token || data.data?.access_token)) {
        const token = data.access_token || data.data.access_token;
        localStorage.setItem("access_token", token);
        localStorage.setItem("merchant_session", "true");

        try {
          const merchRes = await apiService.getMerchantMe(token);
          if (merchRes) {
            const merch = merchRes.merchant || merchRes;
            const store = merchRes.stores?.[0];
            const bName = store?.name || merch?.name;
            if (bName) {
              const profile = {
                fullName: merch?.owner_name || merch?.full_name || bName,
                businessName: bName,
                address: store?.address || merch?.address || "Store Address",
                businessType: store?.store_type || "Restaurant",
              };
              localStorage.setItem("merchant_profile", JSON.stringify(profile));
            }
          }
        } catch (mErr) {}

        router.push("/merchant");
        return;
      }
    } catch (err: any) {
      setError(
        err?.message ||
          "Invalid email or password. If you don't have an account yet, please register your store below!"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-[#17201D]">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
        {/* LOGO */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#087F5B] flex items-center justify-center text-white text-xl shadow-md shadow-[#087F5B]/20">
            🍴
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">NovoEats Merchant Portal</h2>
          <p className="text-xs text-[#66736E] dark:text-slate-400">Sign in to manage your store, orders & earnings</p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Merchant Email</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="store@restaurant.com"
                required
                className="w-full pl-9 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-[#087F5B] text-white text-xs font-black hover:bg-[#065A43] transition-all cursor-pointer shadow-md shadow-[#087F5B]/20 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Merchant Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[#66736E] dark:text-slate-400">New Store Partner?</span>
          <Link
            href="/merchant/register"
            className="text-[#087F5B] dark:text-emerald-400 font-black hover:underline"
          >
            Register Store →
          </Link>
        </div>
      </div>
    </div>
  );
}
