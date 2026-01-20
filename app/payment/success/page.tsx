"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "success" | "pending" | "failed"
  >("loading");
  const [order, setOrder] = useState<any>(null);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // Check payment status
    checkPaymentStatus();
  }, [orderId]);

  const checkPaymentStatus = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);

        // Check status from metadata or order status
        const paymentStatus =
          data.order.metadata?.paymentStatus || data.order.status;

        if (paymentStatus === "PAID" || paymentStatus === "COMPLETED") {
          setStatus("success");
        } else if (
          paymentStatus === "PENDING" ||
          paymentStatus === "PROCESSING"
        ) {
          setStatus("pending");
        } else {
          setStatus("failed");
        }
      } else {
        setStatus("failed");
      }
    } catch (error) {
      console.error("Failed to check payment status:", error);
      setStatus("failed");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-lumi-purple-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Memverifikasi Pembayaran
          </h1>
          <p className="text-gray-400">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {status === "success" ? (
          <>
            {/* Success */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mb-8">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                Pembayaran Berhasil!
              </h1>
              <p className="text-gray-400 mb-4">
                Terima kasih atas pembayaran Anda. Paket hosting Anda sedang
                diproses.
              </p>
              {order && (
                <div className="bg-white/5 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-400 mb-1">Order ID</p>
                  <p className="text-white font-mono">{order.id}</p>
                  <p className="text-sm text-gray-400 mb-1 mt-2">Paket</p>
                  <p className="text-white">
                    {order.planName} Business Lumicloude
                  </p>
                  <p className="text-sm text-gray-400 mb-1 mt-2">Durasi</p>
                  <p className="text-white">
                    {order.duration || 1}{" "}
                    {order.duration === 1 ? "Bulan" : "Bulan"}
                  </p>
                  <p className="text-sm text-gray-400 mb-1 mt-2">
                    Total Pembayaran
                  </p>
                  <p className="text-white font-semibold">
                    Rp {order.price?.toLocaleString() || "0"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="block w-full py-4 bg-gradient-to-r from-lumi-purple-500 to-lumi-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Lihat Dashboard
              </Link>
              <Link
                href="/"
                className="block w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </>
        ) : status === "pending" ? (
          <>
            {/* Pending */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8 mb-8">
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                Pembayaran Sedang Diproses
              </h1>
              <p className="text-gray-400 mb-4">
                Pembayaran Anda sedang diverifikasi. Ini mungkin memakan waktu
                beberapa menit.
              </p>
              {order && (
                <div className="bg-white/5 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-400 mb-1">Order ID</p>
                  <p className="text-white font-mono">{order.id}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={checkPaymentStatus}
                className="block w-full py-4 bg-gradient-to-r from-lumi-purple-500 to-lumi-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Periksa Status
              </button>
              <Link
                href="/"
                className="block w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Failed */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 mb-8">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                Pembayaran Gagal
              </h1>
              <p className="text-gray-400 mb-4">
                Terjadi kesalahan dalam proses pembayaran. Silakan coba lagi
                atau hubungi customer service.
              </p>
              {order && (
                <div className="bg-white/5 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-400 mb-1">Order ID</p>
                  <p className="text-white font-mono">{order.id}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Link
                href="/#pricing"
                className="block w-full py-4 bg-gradient-to-r from-lumi-purple-500 to-lumi-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Coba Lagi
              </Link>
              <Link
                href="/"
                className="block w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
