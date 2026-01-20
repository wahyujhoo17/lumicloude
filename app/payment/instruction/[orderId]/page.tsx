"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Copy,
  Check,
  Clock,
  AlertCircle,
  Building2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function PaymentInstructionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true");
    }

    if (params.orderId) {
      fetchOrderDetails();
    }
  }, [params.orderId, status]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lumi-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat instruksi pembayaran...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Order Tidak Ditemukan
          </h1>
          <Link
            href="/"
            className="text-lumi-purple-400 hover:text-lumi-purple-300"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const paymentDetails = order.metadata?.paymentDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Order Berhasil Dibuat!
              </h1>
              <p className="text-gray-400">
                Silakan selesaikan pembayaran Anda
              </p>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-6">
          {/* Order Info */}
          <div>
            <p className="text-sm text-gray-400 mb-1">Order ID</p>
            <p className="text-white font-mono">{order.id}</p>
          </div>

          {/* Payment Method */}
          <div>
            <p className="text-sm text-gray-400 mb-1">Metode Pembayaran</p>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-lumi-purple-400" />
              <p className="text-white font-semibold">
                {paymentDetails?.channel} Virtual Account
              </p>
            </div>
          </div>

          {/* Virtual Account Number */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Nomor Virtual Account</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-2xl font-bold text-white font-mono tracking-wider">
                {paymentDetails?.paymentNo}
              </p>
              <button
                onClick={() => copyToClipboard(paymentDetails?.paymentNo)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="p-4 bg-gradient-to-r from-lumi-purple-500/10 to-lumi-blue-500/10 border border-lumi-purple-500/20 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Total Pembayaran</p>
            <p className="text-3xl font-bold gradient-text">
              {formatRupiah(paymentDetails?.total || order.price)}
            </p>
            {paymentDetails?.fee > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                (Termasuk biaya admin Rp {formatRupiah(paymentDetails.fee)})
              </p>
            )}
          </div>

          {/* Expiry Time */}
          {paymentDetails?.expired && (
            <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Batas Waktu Pembayaran
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(paymentDetails.expired).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">
              Cara Pembayaran
            </h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-lumi-purple-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-lumi-purple-400">
                  1
                </span>
                <span>
                  Buka aplikasi mobile banking atau ATM bank{" "}
                  {paymentDetails?.channel}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-lumi-purple-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-lumi-purple-400">
                  2
                </span>
                <span>
                  Pilih menu <strong>Transfer</strong> atau{" "}
                  <strong>Virtual Account</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-lumi-purple-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-lumi-purple-400">
                  3
                </span>
                <span>
                  Masukkan nomor Virtual Account:{" "}
                  <strong className="text-white font-mono">
                    {paymentDetails?.paymentNo}
                  </strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-lumi-purple-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-lumi-purple-400">
                  4
                </span>
                <span>
                  Masukkan nominal pembayaran:{" "}
                  <strong className="text-white">
                    {formatRupiah(paymentDetails?.total || order.price)}
                  </strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-lumi-purple-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-lumi-purple-400">
                  5
                </span>
                <span>Konfirmasi transaksi dan selesaikan pembayaran</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-lumi-purple-500/20 rounded-full flex items-center justify-center text-sm font-semibold text-lumi-purple-400">
                  6
                </span>
                <span>
                  Pembayaran akan diverifikasi otomatis dan layanan akan
                  diaktifkan
                </span>
              </li>
            </ol>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-white mb-1">
                  Penting untuk Diperhatikan:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Nominal transfer harus sesuai dengan jumlah di atas</li>
                  <li>Pembayaran akan otomatis dikonfirmasi oleh sistem</li>
                  <li>
                    Jika pembayaran tidak selesai dalam waktu yang ditentukan,
                    order akan dibatalkan otomatis
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href="/"
              className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-center transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <button
              onClick={fetchOrderDetails}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-lumi-purple-500 to-lumi-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Refresh Status
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Butuh bantuan?{" "}
            <a
              href="#contact"
              className="text-lumi-purple-400 hover:text-lumi-purple-300"
            >
              Hubungi Customer Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
