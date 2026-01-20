import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.email !== "admin@lumicloud.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await prisma.plan.findUnique({
      where: { id: params.id },
      include: {
        features: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Paket tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Get plan error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data paket" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.email !== "admin@lumicloud.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      displayName,
      description,
      price,
      storage,
      bandwidth,
      websites,
      isActive,
      isPopular,
      sortOrder,
      features,
    } = await req.json();

    // Update plan
    const plan = await prisma.plan.update({
      where: { id: params.id },
      data: {
        displayName,
        description,
        price: price ? parseInt(price) : undefined,
        storage,
        bandwidth,
        websites,
        isActive,
        isPopular,
        sortOrder: sortOrder ? parseInt(sortOrder) : undefined,
      },
    });

    // Update features if provided
    if (features && Array.isArray(features)) {
      // Delete existing features
      await prisma.planFeature.deleteMany({
        where: { planId: params.id },
      });

      // Create new features
      if (features.length > 0) {
        await prisma.planFeature.createMany({
          data: features.map((feature: any, index: number) => ({
            planId: params.id,
            name: feature.name,
            description: feature.description || null,
            isIncluded: feature.isIncluded !== false,
            sortOrder: index,
          })),
        });
      }
    }

    // Get updated plan with features
    const updatedPlan = await prisma.plan.findUnique({
      where: { id: params.id },
      include: {
        features: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPlan,
    });
  } catch (error) {
    console.error("Update plan error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengupdate paket" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.email !== "admin@lumicloud.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if plan has orders
    const orderCount = await prisma.order.count({
      where: { planId: params.id },
    });

    if (orderCount > 0) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus paket yang sudah memiliki order" },
        { status: 400 },
      );
    }

    await prisma.plan.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Paket berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete plan error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus paket" },
      { status: 500 },
    );
  }
}
