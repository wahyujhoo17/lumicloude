import { useState } from "react";
import { X, Mail, Loader2, RefreshCw } from "lucide-react";

interface VerifyOTPModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerifyOTPModal({
  isOpen,
  email,
  onClose,
  onSuccess,
}: VerifyOTPModalProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verifikasi OTP gagal");
      }

      setSuccessMessage("Email berhasil diverifikasi!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengirim ulang OTP");
      }

      setSuccessMessage("Kode OTP baru telah dikirim ke email Anda");
      setOtp(""); // Clear OTP input
    } catch (err: any) {
      setError(err.message || "Gagal mengirim ulang OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-white/10 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-lumi-blue-500/20 to-lumi-purple-500/20 rounded-xl">
              <Mail className="w-6 h-6 text-lumi-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Verifikasi Email</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Kami telah mengirim kode OTP ke email Anda
          </p>
          <p className="text-lumi-blue-400 text-sm font-medium mt-1">{email}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-400">{successMessage}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kode OTP (6 Digit)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              placeholder="123456"
              maxLength={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-lumi-blue-400 text-center text-2xl tracking-widest font-bold"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Kode OTP berlaku selama 10 menit
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full px-4 py-3 bg-gradient-to-r from-lumi-blue-500 to-lumi-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              "Verifikasi"
            )}
          </button>

          {/* Resend OTP */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="text-sm text-gray-400 hover:text-lumi-blue-400 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              <RefreshCw
                className={`w-4 h-4 ${resending ? "animate-spin" : ""}`}
              />
              {resending ? "Mengirim..." : "Kirim Ulang Kode OTP"}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="p-6 bg-white/5 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Tidak menerima email? Cek folder spam atau{" "}
            <button
              onClick={handleResendOTP}
              className="text-lumi-blue-400 hover:underline"
            >
              kirim ulang kode
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
