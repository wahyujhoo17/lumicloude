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
} from "lucide-react";
import Link from "next/link";

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("bca");
  const [domain, setDomain] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [methodsLoading, setMethodsLoading] = useState(true);

  // Get plan details from URL params
  const planName = searchParams.get("plan") || "";
  const planType = searchParams.get("type") || "";
  const price = searchParams.get("price") || "";
  const period = searchParams.get("period") || "";

  useEffect(() => {
    // Redirect ke home jika tidak ada plan
    if (!planName || !price) {
      router.push("/#pricing");
    }

    // Redirect ke login jika belum login
    if (status === "unauthenticated") {
      router.push("/?login=true");
    }
  }, [planName, price, status, router]);

  // Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch("/api/payment/channels");
        const data = await response.json();

        if (data.success) {
          setPaymentMethods(data.data);
        } else {
          console.error("Failed to fetch payment methods:", data.error);
          // Fallback to static methods if API fails
          setPaymentMethods([
            {
              id: "bca",
              name: "BCA Virtual Account",
              channel: "bca",
              description: "Transfer melalui BCA Virtual Account",
              enabled: true,
              logo: "",
              category: "bank",
            },
            {
              id: "bni",
              name: "BNI Virtual Account",
              channel: "bni",
              description: "Transfer melalui BNI Virtual Account",
              enabled: true,
              logo: "",
              category: "bank",
            },
            // Add more fallback methods as needed
          ]);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        // Fallback to static methods
        setPaymentMethods([
          {
            id: "bca",
            name: "BCA Virtual Account",
            channel: "bca",
            description: "Transfer melalui BCA Virtual Account",
            enabled: true,
            logo: "",
            category: "bank",
          },
        ]);
      } finally {
        setMethodsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const selectedMethod = paymentMethods.find(
        (m) => m.id === selectedPayment,
      );

      if (!selectedMethod) {
        throw new Error("Metode pembayaran tidak valid");
      }

      // QRIS only available in production
      const isDev =
        process.env.NEXT_PUBLIC_ENV === "development" ||
        process.env.NODE_ENV !== "production";
      if (selectedMethod.category === "qris" && isDev) {
        setError(
          "QRIS hanya tersedia di mode produksi. Silakan pilih metode lain.",
        );
        setLoading(false);
        return;
      }

      // Tentukan payment method berdasarkan category
      let paymentMethod = "va"; // default Virtual Account
      if (selectedMethod.category === "ewallet") {
        paymentMethod = "cstore"; // E-wallet menggunakan method cstore di iPaymu
      } else if (selectedMethod.category === "qris") {
        paymentMethod = "qris";
      } else if (selectedMethod.category === "retail") {
        paymentMethod = "cstore";
      } else if (selectedMethod.id === "cc") {
        paymentMethod = "cc";
      }

      const paymentRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          planName: planName,
          planType: planType,
          price: parseInt(price.replace(/\./g, "")),
          paymentMethod: paymentMethod,
          paymentChannel: selectedMethod.channel,
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
                Lengkapi data dan pilih metode pembayaran
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

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pilih Metode Pembayaran
                  </h3>

                  {methodsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-lumi-purple-500" />
                      <span className="ml-2 text-gray-400">
                        Memuat metode pembayaran...
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Group by category */}
                      {[
                        {
                          key: "bank",
                          title: "Transfer Bank / Virtual Account",
                        },
                        { key: "ewallet", title: "E-Wallet" },
                        { key: "qris", title: "QRIS" },
                        { key: "retail", title: "Retail / Convenience Store" },
                      ].map((group) => {
                        const methods = paymentMethods.filter(
                          (m) => m.category === group.key && m.enabled,
                        );
                        if (methods.length === 0) return null;

                        return (
                          <div key={group.key} className="space-y-2">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold px-2">
                              {group.title}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {methods.map((method) => (
                                <label
                                  key={method.id}
                                  className={`relative flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                    selectedPayment === method.id
                                      ? "border-lumi-purple-500 bg-lumi-purple-500/10 shadow-lg shadow-lumi-purple-500/20"
                                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="payment"
                                    value={method.id}
                                    checked={selectedPayment === method.id}
                                    onChange={(e) =>
                                      setSelectedPayment(e.target.value)
                                    }
                                    className="sr-only"
                                  />
                                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-lumi-purple-500/20 to-lumi-blue-500/20 flex-shrink-0">
                                    {method.logo ? (
                                      <img
                                        src={method.logo}
                                        alt={method.name}
                                        className="w-8 h-8 object-contain"
                                      />
                                    ) : method.category === "qris" ? (
                                      <QrCode className="w-6 h-6 text-lumi-purple-500" />
                                    ) : method.category === "ewallet" ? (
                                      <Wallet className="w-6 h-6 text-lumi-purple-500" />
                                    ) : method.category === "retail" ? (
                                      <Store className="w-6 h-6 text-lumi-purple-500" />
                                    ) : (
                                      <Building2 className="w-6 h-6 text-lumi-purple-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white text-sm truncate">
                                      {method.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                      {method.description}
                                    </p>
                                    {method.fee && (
                                      <p className="text-xs text-gray-500">
                                        Biaya:{" "}
                                        {method.fee.ActualFeeType === "PERCENT"
                                          ? `${method.fee.ActualFee}%`
                                          : `Rp ${method.fee.ActualFee.toLocaleString()}`}
                                      </p>
                                    )}
                                  </div>
                                  {selectedPayment === method.id && (
                                    <CheckCircle2 className="w-5 h-5 text-lumi-purple-500 flex-shrink-0" />
                                  )}
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-semibold text-white mb-1">
                      Pembayaran Aman
                    </p>
                    <p>
                      Transaksi Anda diproses dengan aman oleh iPaymu, payment
                      gateway terpercaya di Indonesia.
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
                    <>Lanjut ke Pembayaran</>
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
                  <p className="text-lg font-semibold text-white">{planName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Periode</p>
                  <p className="text-white">{period}</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">Rp {price}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400">Biaya Admin</span>
                    <span className="text-white">Rp 0</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold gradient-text">
                      Rp {price}
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
