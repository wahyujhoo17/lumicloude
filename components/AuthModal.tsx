"use client";

import { useState } from "react";
import { X, Loader2, User, Mail, Lock, Phone } from "lucide-react";
import { signIn } from "next-auth/react";
import VerifyOTPModal from "./VerifyOTPModal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Register jika mode register
      if (!isLogin) {
        console.log("Sending registration request...", formData);
        const registerRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
          }),
        });

        console.log("Registration response status:", registerRes.status);
        const registerData = await registerRes.json();
        console.log("Registration response data:", registerData);

        if (!registerRes.ok) {
          throw new Error(registerData.error || "Registrasi gagal");
        }

        // Jika registrasi berhasil, tutup auth modal dan tampilkan OTP modal
        console.log("Registration successful, showing OTP modal");
        setRegisteredEmail(formData.email);
        onClose(); // Tutup auth modal dulu
        setLoading(false);
        // Delay sedikit agar animasi close selesai
        setTimeout(() => {
          setShowOTPModal(true);
        }, 300);
        return; // Jangan login dulu, tunggu verifikasi OTP
      }

      // Login
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (!signInResult || signInResult.error) {
        throw new Error(
          signInResult?.error ||
            "Login gagal. Silakan cek email dan password Anda.",
        );
      }

      if (!signInResult.ok) {
        throw new Error("Login tidak berhasil. Silakan coba lagi.");
      }

      // Success
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleOTPVerified = () => {
    setShowOTPModal(false);
    setIsLogin(true); // Switch ke mode login
    setFormData({
      ...formData,
      name: "",
      phone: "",
    });
    setError("Email berhasil diverifikasi! Silakan login.");
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError("Email harus diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengirim email reset password");
      }

      // Reset form and show success message
      setShowResetPassword(false);
      setFormData({ ...formData, email: "" });
      setError("Link reset password telah dikirim ke email Anda");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <VerifyOTPModal
        isOpen={showOTPModal}
        email={registeredEmail}
        onClose={() => setShowOTPModal(false)}
        onSuccess={handleOTPVerified}
      />

      {isOpen && (
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
              <h3 className="text-2xl font-bold text-white">
                {showResetPassword
                  ? "Reset Password"
                  : isLogin
                    ? "Masuk ke Akun"
                    : "Daftar Akun Baru"}
              </h3>
              <p className="text-gray-400 mt-2">
                {showResetPassword
                  ? "Masukkan email Anda untuk menerima link reset password"
                  : isLogin
                    ? "Masuk untuk melanjutkan pembelian"
                    : "Buat akun untuk memulai"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {showResetPassword ? (
                // Reset Password Form
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-lumi-purple-500 to-lumi-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Link Reset Password"
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="text-sm text-lumi-purple-400 hover:text-lumi-purple-300 transition-colors"
                    >
                      Kembali ke Login
                    </button>
                  </div>
                </>
              ) : (
                // Login/Register Form
                <>
                  {/* Toggle Login/Register */}
                  <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isLogin
                          ? "bg-lumi-purple-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !isLogin
                          ? "bg-lumi-purple-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Register
                    </button>
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        No. WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none transition-colors"
                        placeholder="08123456789"
                      />
                    </div>
                  )}

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
                    ) : isLogin ? (
                      "Masuk"
                    ) : (
                      "Daftar"
                    )}
                  </button>

                  {isLogin && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(true)}
                        className="text-sm text-lumi-purple-400 hover:text-lumi-purple-300 transition-colors"
                      >
                        Lupa Password?
                      </button>
                    </div>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
