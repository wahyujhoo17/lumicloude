import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // 'hosting' atau 'vps'
    const activeOnly = searchParams.get("activeOnly") !== "false"; // default true

    const where: any = {};
    if (type) {
      where.type = type.toUpperCase();
    }
    if (activeOnly) {
      where.isActive = true;
    }

    const plans = await prisma.plan.findMany({
      where,
      include: {
        features: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error("Get plans error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data paket" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.email !== "admin@lumicloud.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      displayName,
      description,
      type,
      price,
      storage,
      bandwidth,
      websites,
      isActive = true,
      isPopular = false,
      sortOrder = 0,
      features = [],
    } = await req.json();

    if (!name || !displayName || !type || !price) {
      return NextResponse.json(
        { error: "Data paket tidak lengkap" },
        { status: 400 },
      );
    }

    // Check if plan name already exists
    const existingPlan = await prisma.plan.findUnique({
      where: { name },
    });

    if (existingPlan) {
      return NextResponse.json(
        { error: "Nama paket sudah digunakan" },
        { status: 400 },
      );
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        displayName,
        description,
        type,
        price: parseInt(price),
        storage,
        bandwidth,
        websites,
        isActive,
        isPopular,
        sortOrder: parseInt(sortOrder),
        features: {
          create: features.map((feature: any, index: number) => ({
            name: feature.name,
            description: feature.description || null,
            isIncluded: feature.isIncluded !== false,
            sortOrder: index,
          })),
        },
      },
      include: {
        features: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Create plan error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat paket" },
      { status: 500 },
    );
  }
}
