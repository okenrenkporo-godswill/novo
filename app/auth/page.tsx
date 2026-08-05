"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Store, Bike, ShieldAlert, ArrowRight } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/types";

export default function AuthPage() {
  const router = useRouter();
  const { setCurrentRole } = usePlatform();
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(selectedRole);

    if (selectedRole === "customer") router.push("/");
    else if (selectedRole === "merchant") router.push("/merchant");
    else if (selectedRole === "rider") router.push("/rider");
    else if (selectedRole === "admin") router.push("/admin");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-lg">
            🛍️
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {isLogin ? "Welcome Back to Novo" : "Join Novo Platform"}
          </h2>
          <p className="text-xs text-slate-500">
            Select your account type to proceed to your portal.
          </p>
        </div>

        {/* Role Picker */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
          {[
            { id: "customer", label: "Customer", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
            { id: "merchant", label: "Merchant", icon: <Store className="w-3.5 h-3.5" /> },
            { id: "rider", label: "Rider", icon: <Bike className="w-3.5 h-3.5" /> },
            { id: "admin", label: "Admin", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRole(r.id as UserRole)}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === r.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <Input
              label="Full Name / Store Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Godswill / FoodLAND"
              required
            />
          )}
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@domain.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button variant="primary" type="submit" size="lg" className="w-full mt-2" rightIcon={<ArrowRight className="w-4 h-4" />}>
            {isLogin ? "Sign In to Portal" : "Create Account"}
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
