import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const websiteId = formData.get("websiteId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    if (!websiteId) {
      return NextResponse.json(
        { error: "Website ID tidak ditemukan" },
        { status: 400 },
      );
    }

    // Cek apakah website milik user
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

    // Validasi file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 50MB" },
        { status: 400 },
      );
    }

    // Validasi tipe file (zip, tar.gz)
    const allowedTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "application/gzip",
      "application/x-gzip",
      "application/x-tar",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Upload file ZIP atau TAR.GZ" },
        { status: 400 },
      );
    }

    // Buat direktori upload jika belum ada
    const uploadDir = path.join(process.cwd(), "uploads", websiteId);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate nama file unik
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // Simpan file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Simpan info ke database
    const fileUpload = await prisma.fileUpload.create({
      data: {
        websiteId,
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: filepath,
      },
    });

    // TODO: Extract file dan deploy ke aaPanel
    // Akan diimplementasikan di API aaPanel

    return NextResponse.json({
      success: true,
      file: fileUpload,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat upload file" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get("websiteId");

    if (!websiteId) {
      return NextResponse.json(
        { error: "Website ID tidak ditemukan" },
        { status: 400 },
      );
    }

    // Cek apakah website milik user
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

    const files = await prisma.fileUpload.findMany({
      where: { websiteId },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Get uploads error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data file" },
      { status: 500 },
    );
  }
}
