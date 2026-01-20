"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalUsers: number;
  totalPlans: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.email !== "admin@lumicloud.com") {
      router.push("/");
      return;
    }

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-lumi-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.email !== "admin@lumicloud.com") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-lumi-blue-400" />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                Welcome, {session.user?.name}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Package className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Plans</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalPlans || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalOrders || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  Rp {stats?.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/plans"
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-lumi-blue-400 transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <Package className="w-8 h-8 text-lumi-blue-400" />
              <h3 className="text-lg font-semibold text-white group-hover:text-lumi-blue-400 transition-colors">
                Manage Plans
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              Create, edit, and manage hosting and VPS plans
            </p>
          </Link>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <Users className="w-8 h-8 text-green-400" />
              <h3 className="text-lg font-semibold text-white">
                User Management
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              View and manage user accounts (Coming Soon)
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <CreditCard className="w-8 h-8 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Order Management
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              View and manage customer orders (Coming Soon)
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <BarChart3 className="w-8 h-8 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Analytics</h3>
            </div>
            <p className="text-gray-400 text-sm">
              View detailed analytics and reports (Coming Soon)
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Settings</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Configure system settings (Coming Soon)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
