import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAAPanelService } from "@/lib/aapanel";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionId, domain } = await req.json();

    if (!subscriptionId || !domain) {
      return NextResponse.json(
        { error: "Subscription ID dan domain harus diisi" },
        { status: 400 },
      );
    }

    // Cek subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: session.user.id,
        status: "ACTIVE",
      },
      include: {
        website: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription tidak ditemukan atau tidak aktif" },
        { status: 404 },
      );
    }

    if (subscription.website) {
      return NextResponse.json(
        { error: "Website sudah dibuat untuk subscription ini" },
        { status: 400 },
      );
    }

    // Buat website di aaPanel
    const aapanel = getAAPanelService();
    const result = await aapanel.createWebsite({
      domain: domain,
      php_version: "74",
      ssl: true,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Simpan info website ke database
    const website = await prisma.website.create({
      data: {
        userId: session.user.id,
        subscriptionId: subscription.id,
        domain: domain,
        aaPanelSiteId: result.data.site_id,
        ftpUsername: result.data.ftp_username,
        ftpPassword: result.data.ftp_password,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      website,
    });
  } catch (error) {
    console.error("Create website error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat website" },
      { status: 500 },
    );
  }
}
