"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    period: string;
    features: string[];
  };
  planType: "hosting" | "vps";
}

export default function OrderModal({
  isOpen,
  onClose,
  plan,
  planType,
}: OrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    domain: planType === "hosting" ? "" : undefined,
  });
  const [isLogin, setIsLogin] = useState(false);
  const { data: session } = useSession();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Skip auth jika user sudah login
      if (!session) {
        // Step 1: Register (jika belum punya akun)
        if (!isLogin) {
          console.log("Registering user...");
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

          const registerData = await registerRes.json();
          console.log("Register response:", registerData);

          if (!registerRes.ok) {
            throw new Error(registerData.error || "Registrasi gagal");
          }
        }

        // Step 2: Login menggunakan NextAuth
        console.log("Logging in...");
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        console.log("SignIn result:", signInResult);

        if (!signInResult || signInResult.error) {
          throw new Error(
            signInResult?.error ||
              "Login gagal. Silakan cek email dan password Anda.",
          );
        }

        if (!signInResult.ok) {
          throw new Error("Login tidak berhasil. Silakan coba lagi.");
        }

        // Wait a bit untuk memastikan session sudah terbuat
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Step 3: Create payment (untuk user yang sudah login atau baru login)
      console.log("Creating payment...");
      const paymentRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          planName: plan.name,
          planType: planType,
          price: parseInt(plan.price.replace(/\./g, "")),
          metadata: {
            domain: formData.domain || null,
            source: "pricing-page",
          },
        }),
      });

      const paymentData = await paymentRes.json();
      console.log("Payment response:", paymentData);

      if (!paymentRes.ok) {
        throw new Error(paymentData.error || "Gagal membuat pembayaran");
      }

      // Redirect ke halaman pembayaran iPaymu
      if (paymentData.paymentUrl) {
        console.log("Redirecting to payment URL:", paymentData.paymentUrl);
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error("Payment URL tidak ditemukan");
      }
    } catch (err: any) {
      console.error("Order error:", err);
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white mb-2">
            Order {plan.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold gradient-text">
              Rp {plan.price}
            </span>
            <span className="text-gray-400">{plan.period}</span>
          </div>
          {session?.user && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Logged in sebagai {session.user.name || session.user.email}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Hanya tampilkan form login/register jika user belum login */}
          {!session && (
            <>
              {/* Toggle Login/Register */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
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
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
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
            </>
          )}

          {planType === "hosting" && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Domain (Optional)
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) =>
                  setFormData({ ...formData, domain: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none transition-colors"
                placeholder="example.com"
              />
              <p className="text-xs text-gray-500 mt-2">
                Kosongkan jika belum punya domain
              </p>
            </div>
          )}

          {/* Features preview */}
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Yang Anda Dapatkan:</p>
            <ul className="space-y-1">
              {plan.features.slice(0, 4).map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  {feature}
                </li>
              ))}
              {plan.features.length > 4 && (
                <li className="text-xs text-gray-500">
                  +{plan.features.length - 4} fitur lainnya
                </li>
              )}
            </ul>
          </div>

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
              `Bayar Rp ${plan.price}`
            )}
          </button>

          <p className="text-xs text-center text-gray-500">
            Anda akan diarahkan ke halaman pembayaran iPaymu
          </p>
        </form>
      </div>
    </div>
  );
}
