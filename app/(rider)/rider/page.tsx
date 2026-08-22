"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bike,
  Power,
  ShieldCheck,
  MapPin,
  Store,
  Phone,
  CheckCircle2,
  DollarSign,
  Clock,
  ArrowRight,
  Navigation,
} from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";

export default function RiderHubPage() {
  const { riderProfile, toggleRiderOnline, orders, acceptDeliveryJob, completeDelivery, updateOrderStatus } =
    usePlatform();

  const activeOrder = orders.find(
    (o) => o.id === riderProfile.currentOrderId || (o.status === "rider_assigned" || o.status === "picked_up")
  );

  const availableJobs = orders.filter((o) => o.status === "ready_for_pickup");

  const [jobOfferModal, setJobOfferModal] = useState(false);
  const [targetJobId, setTargetJobId] = useState<string | null>(null);
  const [offerTimer, setOfferTimer] = useState(15);

  useEffect(() => {
    if (riderProfile.isOnline && availableJobs.length > 0 && !activeOrder && !jobOfferModal) {
      setTargetJobId(availableJobs[0].id);
      setJobOfferModal(true);
      setOfferTimer(15);
    }
  }, [riderProfile.isOnline, availableJobs, activeOrder, jobOfferModal]);

  useEffect(() => {
    if (!jobOfferModal) return;
    const interval = setInterval(() => {
      setOfferTimer((prev) => {
        if (prev <= 1) {
          setJobOfferModal(false);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [jobOfferModal]);

  const handleAcceptJob = () => {
    if (targetJobId) {
      acceptDeliveryJob(targetJobId);
      setJobOfferModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen flex flex-col gap-6">
      {/* RIDER PROFILE HEADER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={riderProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={riderProfile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
            />
            {riderProfile.isVerified && (
              <ShieldCheck className="w-5 h-5 text-emerald-400 absolute -bottom-1 -right-1 bg-slate-900 rounded-full" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black">{riderProfile.name}</h2>
              <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">
                {riderProfile.vehiclePlate}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {riderProfile.totalDeliveries} Completed Deliveries • {riderProfile.rating} ★ Rating
            </p>
          </div>
        </div>

        {/* ONLINE TOGGLE SWITCH */}
        <button
          onClick={toggleRiderOnline}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md ${
            riderProfile.isOnline
              ? "bg-emerald-500 text-white hover:bg-emerald-600 animate-pulse"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{riderProfile.isOnline ? "ONLINE - Ready for Jobs" : "OFFLINE - Go Online"}</span>
        </button>
      </div>

      {/* QUICK RIDER STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Today&apos;s Earnings</span>
          <span className="text-xl font-black text-slate-900 dark:text-slate-100">
            ₦{riderProfile.earningsToday.toLocaleString()}
          </span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Tips Collected</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            ₦{riderProfile.tipsToday.toLocaleString()}
          </span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Delivery</span>
          <span className="text-xl font-black text-slate-900 dark:text-slate-100">
            {activeOrder ? "1 In Progress" : "None"}
          </span>
        </div>
      </div>

      {/* ACTIVE DELIVERY JOB NAVIGATION STEPPER */}
      {activeOrder && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Active Job Task #{activeOrder.id}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Deliver to {activeOrder.customerName}
              </h3>
            </div>
            <StatusBadge status={activeOrder.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* STEP 1: PICKUP MERCHANT */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-sm">
                <Store className="w-4 h-4 text-amber-500" />
                <span>1. Pickup Store</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{activeOrder.storeName}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{activeOrder.storeAddress}</p>
              <div className="mt-2 text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded-xl border font-bold text-amber-600">
                Pickup Code: {activeOrder.pickupCode || "4819"}
              </div>
            </div>

            {/* STEP 2: DROP OFF CUSTOMER */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-black text-sm">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>2. Delivery Dropoff</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{activeOrder.customerName}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{activeOrder.deliveryAddress}</p>
              <a href={`tel:${activeOrder.customerPhone}`} className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Call Customer ({activeOrder.customerPhone})</span>
              </a>
            </div>
          </div>

          {/* ACTION BUTTONS FOR JOB STEPS */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Earnings Payout</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                ₦{(activeOrder.deliveryFee + activeOrder.tip).toLocaleString()}
              </p>
            </div>

            {activeOrder.status === "rider_assigned" && (
              <Button
                variant="primary"
                onClick={() => updateOrderStatus(activeOrder.id, "picked_up")}
                leftIcon={<Navigation className="w-4 h-4" />}
              >
                Confirm Store Pickup
              </Button>
            )}

            {activeOrder.status === "picked_up" && (
              <Button
                variant="primary"
                onClick={() => completeDelivery(activeOrder.id)}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete Delivery Job
              </Button>
            )}
          </div>
        </div>
      )}

      {/* AVAILABLE DELIVERY JOBS DISPATCH FEED */}
      {!activeOrder && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Available Delivery Offers ({availableJobs.length})
          </h3>
          {availableJobs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-medium">
              {riderProfile.isOnline ? "Waiting for new orders in your area..." : "You are offline. Toggle Online to accept delivery jobs."}
            </div>
          ) : (
            availableJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                    Pickup: {job.storeName}
                  </span>
                  <span className="text-xs text-slate-500">Deliver to: {job.deliveryAddress}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Payout: ₦{(job.deliveryFee + job.tip).toLocaleString()}
                  </span>
                </div>
                <Button variant="primary" size="sm" onClick={() => acceptDeliveryJob(job.id)}>
                  Accept Job Offer
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* BROADCAST OFFER POPUP MODAL */}
      <Modal isOpen={jobOfferModal} onClose={() => setJobOfferModal(false)} title="New Delivery Request!">
        <div className="flex flex-col gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
            🛵
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold uppercase">Estimated Earnings</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">₦950</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs text-left flex flex-col gap-1">
            <span className="font-bold text-slate-900 dark:text-slate-100">Pickup: FoodLAND Restaurant</span>
            <span className="text-slate-500">Dropoff: 14 Commercial Avenue (2.4 km)</span>
          </div>

          <div className="text-xs font-bold text-amber-500 font-mono">
            Offer expires in {offerTimer}s
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setJobOfferModal(false)} className="flex-1">
              Decline
            </Button>
            <Button variant="primary" onClick={handleAcceptJob} className="flex-1">
              Accept Offer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
