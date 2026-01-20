import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user dengan semua relasi
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        subscriptions: {
          where: { status: "ACTIVE" },
          include: {
            order: true,
            website: {
              include: {
                files: {
                  orderBy: { uploadedAt: "desc" },
                  take: 3,
                },
              },
            },
          },
        },
        websites: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // Remove password dari response
    const { password, ...userWithoutPassword } = user;

    // Count statistics
    const stats = {
      totalOrders: await prisma.order.count({
        where: { userId: user.id },
      }),
      activeSubscriptions: await prisma.subscription.count({
        where: {
          userId: user.id,
          status: "ACTIVE",
        },
      }),
      totalWebsites: await prisma.website.count({
        where: { userId: user.id },
      }),
      pendingOrders: await prisma.order.count({
        where: {
          userId: user.id,
          status: "PENDING",
        },
      }),
    };

    return NextResponse.json({
      user: userWithoutPassword,
      stats,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data dashboard" },
      { status: 500 },
    );
  }
}
