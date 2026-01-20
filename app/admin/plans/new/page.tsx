"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

interface PlanFeature {
  name: string;
  description?: string;
  isIncluded: boolean;
}

export default function NewPlanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    type: "HOSTING",
    price: "",
    storage: "",
    bandwidth: "",
    websites: "",
    isActive: true,
    isPopular: false,
    sortOrder: "0",
  });

  const [features, setFeatures] = useState<PlanFeature[]>([
    { name: "", description: "", isIncluded: true },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureChange = (
    index: number,
    field: keyof PlanFeature,
    value: string | boolean,
  ) => {
    setFeatures((prev) =>
      prev.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature,
      ),
    );
  };

  const addFeature = () => {
    setFeatures((prev) => [
      ...prev,
      { name: "", description: "", isIncluded: true },
    ]);
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.name || !formData.displayName || !formData.price) {
        throw new Error("Nama paket, nama tampilan, dan harga wajib diisi");
      }

      // Filter out empty features
      const validFeatures = features.filter((f) => f.name.trim() !== "");

      const response = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: validFeatures,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat paket");
      }

      router.push("/admin/plans");
    } catch (err: any) {
      console.error("Create plan error:", err);
      setError(err.message || "Terjadi kesalahan saat membuat paket");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-lumi-purple-500" />
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    session?.user?.email !== "admin@lumicloud.com"
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/plans"
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Buat Paket Baru</h1>
            <p className="text-gray-400 mt-2">
              Tambahkan paket hosting atau VPS baru
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Informasi Dasar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Paket *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                  placeholder="starter"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nama unik untuk identifikasi (lowercase, no spaces)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Tampilan *
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                  placeholder="Starter"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                  placeholder="Deskripsi paket..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipe Paket *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                  required
                >
                  <option value="HOSTING">Hosting</option>
                  <option value="VPS">VPS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Harga per Bulan (Rp) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                  placeholder="15000"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Spesifikasi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Storage
                </label>
                <input
                  type="text"
                  name="storage"
                  value={formData.storage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                  placeholder="500 MB NVMe SSD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bandwidth
                </label>
                <input
                  type="text"
                  name="bandwidth"
                  value={formData.bandwidth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                  placeholder="5 GB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jumlah Website
                </label>
                <input
                  type="text"
                  name="websites"
                  value={formData.websites}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Pengaturan
            </h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span className="text-gray-300">
                  Paket aktif (dapat dipesan)
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span className="text-gray-300">
                  Tandai sebagai paket populer
                </span>
              </label>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Fitur Paket</h2>
              <button
                type="button"
                onClick={addFeature}
                className="bg-lumi-purple-500 hover:bg-lumi-purple-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Tambah Fitur
              </button>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={feature.name}
                      onChange={(e) =>
                        handleFeatureChange(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                      placeholder="Nama fitur"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={feature.description || ""}
                      onChange={(e) =>
                        handleFeatureChange(
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-lumi-purple-500 focus:outline-none"
                      placeholder="Deskripsi (opsional)"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={feature.isIncluded}
                        onChange={(e) =>
                          handleFeatureChange(
                            index,
                            "isIncluded",
                            e.target.checked,
                          )
                        }
                        className="mr-2"
                      />
                      Termasuk
                    </label>
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/plans"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-lumi-purple-500 hover:bg-lumi-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Membuat...
                </>
              ) : (
                "Buat Paket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
