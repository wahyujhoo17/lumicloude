"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  Building2,
  Smartphone,
  ArrowLeft,
  Shield,
  Wallet,
  QrCode,
  Store,
  Calendar,
  HardDrive,
  Zap,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [domain, setDomain] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(1); // Default 1 bulan
  const [planData, setPlanData] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  // Get plan details from URL params
  const planName = searchParams.get("plan") || "";
  const planType = searchParams.get("type") || "";
  const basePrice = searchParams.get("price") || "";
  const period = searchParams.get("period") || "";

  // Calculate price based on duration with discount
  const calculatePrice = (basePrice: string, duration: number) => {
    const base = parseInt(basePrice.replace(/\./g, "")) || 0;
    let discount = 0;

    // Apply discount based on duration
    if (duration === 3)
      discount = 0.03; // 3% discount
    else if (duration === 6)
      discount = 0.06; // 6% discount
    else if (duration === 12) discount = 0.12; // 12% discount

    const discountedPrice = base * duration * (1 - discount);
    return Math.round(discountedPrice);
  };

  // Get discount percentage for display
  const getDiscountPercentage = (duration: number) => {
    if (duration === 3) return 3;
    if (duration === 6) return 6;
    if (duration === 12) return 12;
    return 0;
  };

  const price = calculatePrice(basePrice, selectedDuration);

  // Format display name with branding
  const displayPlanName = planData
    ? `${planData.displayName} ${planType === "vps" ? "VPS" : "Hosting"} Lumicloud`
    : "";

  useEffect(() => {
    // Redirect ke home jika tidak ada plan
    if (!planName || !basePrice) {
      router.push("/#pricing");
    }

    // Redirect ke login jika belum login
    if (status === "unauthenticated") {
      router.push("/?login=true");
    }
  }, [planName, basePrice, status, router]);

  // Fetch plan data from database
  useEffect(() => {
    const fetchPlanData = async () => {
      if (!planName) return;

      try {
        setLoadingPlan(true);
        const response = await fetch(`/api/plans?type=hosting`);
        const data = await response.json();

        if (data.success) {
          // Find plan by name (case insensitive)
          const plan = data.data.find(
            (p: any) => p.name.toLowerCase() === planName.toLowerCase(),
          );

          if (plan) {
            setPlanData(plan);
          } else {
            console.error("Plan not found:", planName);
          }
        }
      } catch (error) {
        console.error("Error fetching plan data:", error);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlanData();
  }, [planName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const paymentRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          planId: planData?.id || null,
          planName: planName,
          planType: planType,
          price: price,
          duration: selectedDuration,
          metadata: {
            domain: domain || null,
            source: "order-page",
          },
        }),
      });

      const paymentData = await paymentRes.json();

      console.log("Payment API Response:", paymentData);

      if (!paymentRes.ok) {
        console.error("Payment failed:", paymentData);
        throw new Error(paymentData.error || "Gagal membuat pembayaran");
      }

      // Redirect ke halaman pembayaran iPaymu
      const redirectUrl =
        paymentData.paymentUrl || paymentData.data?.paymentUrl;

      if (redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.error("Payment URL not found in response:", paymentData);
        throw new Error(
          "Payment URL tidak ditemukan. Silakan hubungi customer service.",
        );
      }
    } catch (err: any) {
      console.error("Order error:", err);
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-lumi-purple-500" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Paket
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Checkout Order
              </h1>
              <p className="text-gray-400 mb-8">
                Pilih durasi paket dan lengkapi informasi domain
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* User Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Informasi Pembeli
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Nama
                      </label>
                      <input
                        type="text"
                        value={session.user.name || ""}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={session.user.email || ""}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Domain Input (optional) */}
                {planType === "hosting" && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Domain (Optional)
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none transition-colors"
                      placeholder="example.com"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Kosongkan jika belum punya domain
                    </p>
                  </div>
                )}

                {/* Package Duration Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Pilih Durasi Paket
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 3, 6, 12].map((months) => (
                      <label
                        key={months}
                        className={`relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedDuration === months
                            ? "border-lumi-purple-500 bg-lumi-purple-500/10 shadow-lg shadow-lumi-purple-500/20"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name="duration"
                          value={months}
                          checked={selectedDuration === months}
                          onChange={(e) =>
                            setSelectedDuration(parseInt(e.target.value))
                          }
                          className="sr-only"
                        />
                        <div className="text-center">
                          <p className="font-semibold text-white">
                            {months} {months === 1 ? "Bulan" : "Bulan"}
                          </p>
                          {months > 1 && (
                            <p className="text-xs text-lumi-gold-400 font-semibold">
                              Diskon {getDiscountPercentage(months)}%
                            </p>
                          )}
                        </div>
                        {selectedDuration === months && (
                          <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-lumi-purple-500" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Package Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    Spesifikasi Paket
                  </h3>

                  {loadingPlan ? (
                    <div className="bg-white/5 rounded-lg p-6 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-lumi-purple-500" />
                      <span className="ml-2 text-gray-400">
                        Memuat spesifikasi...
                      </span>
                    </div>
                  ) : planData ? (
                    <div className="bg-white/5 rounded-lg p-6 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <HardDrive className="w-5 h-5 text-lumi-purple-500" />
                          <div>
                            <p className="text-sm text-gray-400">Storage</p>
                            <p className="text-white font-semibold">
                              {planData.storage}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-lumi-purple-500" />
                          <div>
                            <p className="text-sm text-gray-400">Bandwidth</p>
                            <p className="text-white font-semibold">
                              {planData.bandwidth}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-lumi-purple-500" />
                          <div>
                            <p className="text-sm text-gray-400">Website</p>
                            <p className="text-white font-semibold">
                              {planData.websites}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-lumi-purple-500" />
                          <div>
                            <p className="text-sm text-gray-400">
                              SSL Certificate
                            </p>
                            <p className="text-white font-semibold">Free SSL</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-white font-semibold mb-2">
                          Fitur Utama:
                        </h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {planData.features
                            .slice(0, 6)
                            .map((feature: any, index: number) => (
                              <li key={index}>• {feature.name}</li>
                            ))}
                          {planData.features.length > 6 && (
                            <li className="text-lumi-purple-400">
                              • Dan {planData.features.length - 6} fitur
                              lainnya...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-lg p-6 text-center">
                      <p className="text-gray-400">
                        Spesifikasi paket tidak ditemukan
                      </p>
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-semibold text-white mb-1">
                      Pembayaran Aman & Langsung
                    </p>
                    <p>
                      Setelah klik "Bayar Sekarang", Anda akan diarahkan ke
                      halaman pembayaran iPaymu yang aman dan terpercaya untuk
                      memilih metode pembayaran dan menyelesaikan transaksi.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-lumi-purple-500 to-lumi-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>Bayar Sekarang</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">
                Ringkasan Order
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Paket</p>
                  <p className="text-lg font-semibold text-white">
                    {displayPlanName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Durasi</p>
                  <p className="text-white">
                    {selectedDuration}{" "}
                    {selectedDuration === 1 ? "Bulan" : "Bulan"}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Harga per Bulan</span>
                    <span className="text-white">
                      Rp{" "}
                      {parseInt(basePrice.replace(/\./g, "")).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400">
                      Durasi ({selectedDuration} bulan)
                    </span>
                    <span className="text-white">x {selectedDuration}</span>
                  </div>
                  {getDiscountPercentage(selectedDuration) > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lumi-gold-400">
                        Diskon {getDiscountPercentage(selectedDuration)}%
                      </span>
                      <span className="text-lumi-gold-400">
                        -Rp{" "}
                        {(
                          parseInt(basePrice.replace(/\./g, "")) *
                          selectedDuration *
                          (getDiscountPercentage(selectedDuration) / 100)
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold gradient-text">
                      Rp {price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
