import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.email !== "admin@lumicloud.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get admin statistics
    const [totalUsers, totalPlans, totalOrders, totalRevenue] =
      await Promise.all([
        prisma.user.count(),
        prisma.plan.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: {
            price: true,
          },
          where: {
            status: "COMPLETED",
          },
        }),
      ]);

    const stats = {
      totalUsers,
      totalPlans,
      totalOrders,
      totalRevenue: totalRevenue._sum.price || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data dashboard admin" },
      { status: 500 },
    );
  }
}
