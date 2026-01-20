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

    const { websiteId, fileUploadId } = await req.json();

    if (!websiteId || !fileUploadId) {
      return NextResponse.json(
        { error: "Website ID dan File Upload ID harus diisi" },
        { status: 400 },
      );
    }

    // Cek website
    const website = await prisma.website.findFirst({
      where: {
        id: websiteId,
        userId: session.user.id,
      },
    });

    if (!website) {
      return NextResponse.json(
        { error: "Website tidak ditemukan" },
        { status: 404 },
      );
    }

    // Cek file upload
    const fileUpload = await prisma.fileUpload.findFirst({
      where: {
        id: fileUploadId,
        websiteId: websiteId,
      },
    });

    if (!fileUpload) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 404 },
      );
    }

    const aapanel = getAAPanelService();

    // 1. Upload file ke aaPanel
    const uploadResult = await aapanel.uploadFile(
      website.aaPanelSiteId || "",
      fileUpload.path,
      `/www/wwwroot/${website.domain}/`,
    );

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: `Upload gagal: ${uploadResult.error}` },
        { status: 500 },
      );
    }

    // 2. Extract file jika ZIP
    if (
      fileUpload.mimeType === "application/zip" ||
      fileUpload.mimeType === "application/x-zip-compressed"
    ) {
      const extractResult = await aapanel.extractZip(
        website.aaPanelSiteId || "",
        `/www/wwwroot/${website.domain}/${fileUpload.filename}`,
        `/www/wwwroot/${website.domain}/`,
      );

      if (!extractResult.success) {
        return NextResponse.json(
          { error: `Extract gagal: ${extractResult.error}` },
          { status: 500 },
        );
      }
    }

    // 3. Set permission
    await aapanel.setPermission(
      website.aaPanelSiteId || "",
      `/www/wwwroot/${website.domain}/`,
      "755",
    );

    return NextResponse.json({
      success: true,
      message: "Website berhasil di-deploy",
    });
  } catch (error) {
    console.error("Deploy website error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat deploy website" },
      { status: 500 },
    );
  }
}
