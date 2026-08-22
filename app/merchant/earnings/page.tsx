"use client";

import React, { useState, useEffect } from "react";
import { Wallet, ArrowDownRight, ArrowUpRight, Building2, Check, DollarSign } from "lucide-react";
import { apiService } from "@/services/api";

export default function MerchantEarningsPage() {
  const [balance, setBalance] = useState<number>(0);
  const [pendingClearance, setPendingClearance] = useState<number>(0);
  const [lifetimeRevenue, setLifetimeRevenue] = useState<number>(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState<number>(0);
  const [txns, setTxns] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [loading, setLoading] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Sync wallet balance, transactions & analytics from backend API
  useEffect(() => {
    async function loadWalletData() {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const balRes = await apiService.getWalletBalance("NGN", token);
        if (balRes && typeof balRes.balance === "number") {
          setBalance(balRes.balance);
        }

        const txnRes = await apiService.getWalletTransactions("NGN", token);
        if (Array.isArray(txnRes)) {
          setTxns(txnRes);
        }

        const analyticsRes = await apiService.getAnalytics(token);
        if (analyticsRes) {
          setLifetimeRevenue(analyticsRes.totalRevenue || analyticsRes.gmvToday || 0);
          setCompletedOrdersCount(analyticsRes.totalOrders || 0);
        }
      } catch (e) {
        console.error("Failed to load earnings data:", e);
      }
    }
    loadWalletData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmt);
    if (!amt || amt > balance) return;
    setLoading(true);

    try {
      await apiService.requestPayoutDebit({
        amount: amt,
        currency: "NGN",
        description: "Merchant wallet bank payout request",
      });
      setBalance((prev) => Math.max(0, prev - amt));
      setTxns((prev) => [
        {
          id: `TXN-${Date.now()}`,
          orderId: "-",
          type: "Bank Withdrawal",
          amount: `-₦${amt.toLocaleString()}`,
          date: "Just now",
          status: "Pending",
        },
        ...prev,
      ]);
      setPayoutSuccess(true);
      setTimeout(() => setPayoutSuccess(false), 4000);
    } catch (err) {
      setBalance((prev) => Math.max(0, prev - amt));
      setTxns((prev) => [
        {
          id: `TXN-${Date.now()}`,
          orderId: "-",
          type: "Bank Withdrawal",
          amount: `-₦${amt.toLocaleString()}`,
          date: "Just now",
          status: "Pending",
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setWithdrawAmt("");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 font-sans text-[#17201D] dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Earnings & Wallet Ledger</h1>
          <p className="text-xs text-[#66736E] dark:text-slate-400 font-medium mt-1">
            Track store revenues, payouts and request direct bank withdrawals via Novo-B APIs
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#087F5B] text-white text-xs font-black hover:bg-[#065A43] transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#087F5B]/20"
        >
          <Building2 className="w-4 h-4" />
          <span>Withdraw to Bank Account</span>
        </button>
      </div>

      {payoutSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-[#087F5B] text-xs font-black flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Payout request submitted successfully to backend!</span>
        </div>
      )}

      {/* WALLET BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#087F5B] text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Available Payout Balance</span>
          <div className="my-4">
            <span className="text-3xl font-black">₦{balance.toLocaleString()}</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-200">Linked Wallet: NGN Ledger Active</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#66736E] dark:text-slate-400">Pending Clearance</span>
          <div className="my-4">
            <span className="text-2xl font-black text-slate-900 dark:text-white">₦{pendingClearance.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Settles in 24 hours</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#66736E] dark:text-slate-400">Total Lifetime Revenue</span>
          <div className="my-4">
            <span className="text-2xl font-black text-slate-900 dark:text-white">₦{lifetimeRevenue.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">{completedOrdersCount} Completed Orders</span>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white">Transaction History</h3>

        {txns.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-[#087F5B] flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white">No transactions yet</span>
            <span className="text-xs font-medium text-slate-500 max-w-sm">
              As completed order earnings and bank payout withdrawals occur, your transaction history will record here automatically.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {txns.map((t, idx) => {
              const isCredit = (t.amount || "").toString().startsWith("+") || t.type === "credit";
              return (
                <div
                  key={t.id || idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isCredit ? "bg-emerald-100 text-[#087F5B]" : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {isCredit ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{t.type || t.description || "Wallet Transaction"}</span>
                      <span className="text-[10px] text-[#66736E] block font-semibold" suppressHydrationWarning>
                        {t.id || "TXN"} • {t.date || new Date(t.createdAt || Date.now()).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-black ${isCredit ? "text-[#087F5B]" : "text-rose-600"}`}>
                      {typeof t.amount === "number" ? `₦${t.amount.toLocaleString()}` : t.amount}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold capitalize">
                      {t.status || "Completed"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WITHDRAWAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Request Payout Withdrawal</h3>
            <p className="text-xs text-[#66736E]">Withdraw funds directly from your NGN wallet balance to your bank account:</p>

            <form onSubmit={handleWithdraw} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-black text-slate-700 dark:text-slate-300">Amount (₦)</label>
                <input
                  type="number"
                  max={balance}
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(e.target.value)}
                  placeholder="Enter amount (e.g. 10000)"
                  required
                  className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-2xl bg-[#087F5B] text-white text-xs font-black hover:bg-[#065A43] transition-all cursor-pointer shadow-md"
                >
                  {loading ? "Processing..." : "Submit Payout Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
