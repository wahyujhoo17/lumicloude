"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: "HOSTING" | "VPS";
  price: number;
  storage: string;
  bandwidth: string;
  websites: string;
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
  features: PlanFeature[];
  createdAt: string;
  updatedAt: string;
}

interface PlanFeature {
  id: string;
  name: string;
  description?: string;
  isIncluded: boolean;
  sortOrder: number;
}

export default function AdminPlansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true");
    } else if (
      status === "authenticated" &&
      session?.user?.email !== "admin@lumicloud.com"
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.email === "admin@lumicloud.com"
    ) {
      fetchPlans();
    }
  }, [status, session]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/plans?activeOnly=false");
      const data = await response.json();

      if (data.success) {
        setPlans(data.data);
      } else {
        setError("Gagal mengambil data paket");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const togglePlanStatus = async (planId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        setPlans(
          plans.map((plan) =>
            plan.id === planId ? { ...plan, isActive: !isActive } : plan,
          ),
        );
      } else {
        setError("Gagal mengupdate status paket");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      setError("Terjadi kesalahan saat mengupdate paket");
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return;

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPlans(plans.filter((plan) => plan.id !== planId));
      } else {
        setError("Gagal menghapus paket");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      setError("Terjadi kesalahan saat menghapus paket");
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Kelola Paket</h1>
            <p className="text-gray-400 mt-2">
              Kelola paket hosting dan VPS yang tersedia
            </p>
          </div>
          <Link
            href="/admin/plans/new"
            className="bg-lumi-purple-500 hover:bg-lumi-purple-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Paket
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
            <button
              onClick={() => setError("")}
              className="float-right ml-4 text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Plans Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-lumi-purple-500" />
            <span className="ml-2 text-gray-400">Memuat paket...</span>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Paket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {plan.displayName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {plan.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            plan.type === "HOSTING"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {plan.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        Rp {plan.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {plan.isActive ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <span
                            className={`text-sm ${
                              plan.isActive ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {plan.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                          {plan.isPopular && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              togglePlanStatus(plan.id, plan.isActive)
                            }
                            className={`p-1 rounded ${
                              plan.isActive
                                ? "text-gray-400 hover:text-red-400"
                                : "text-gray-400 hover:text-green-400"
                            }`}
                            title={plan.isActive ? "Nonaktifkan" : "Aktifkan"}
                          >
                            {plan.isActive ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            href={`/admin/plans/${plan.id}/edit`}
                            className="p-1 text-gray-400 hover:text-blue-400"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deletePlan(plan.id)}
                            className="p-1 text-gray-400 hover:text-red-400"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {plans.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Belum ada paket yang dibuat</p>
                <Link
                  href="/admin/plans/new"
                  className="text-lumi-purple-400 hover:text-lumi-purple-300 mt-2 inline-block"
                >
                  Buat paket pertama →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
