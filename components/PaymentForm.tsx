"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  planName: string;
  planType: string;
  price: number;
}

export default function PaymentForm({
  planName,
  planType,
  price,
}: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planName,
          planType,
          price,
          metadata: {
            source: "pricing-page",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pembayaran");
      }

      // Redirect ke halaman pembayaran iPaymu
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Payment URL tidak ditemukan");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-lumi-purple-500 to-lumi-blue-500 
                   text-white py-3 px-6 rounded-lg font-semibold 
                   hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </button>
    </div>
  );
}
