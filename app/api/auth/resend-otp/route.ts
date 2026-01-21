import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmailService, generateOTP, getOTPExpiry } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validasi input
    if (!email) {
      return NextResponse.json({ error: "Email harus diisi" }, { status: 400 });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak ditemukan" },
        { status: 404 },
      );
    }

    // Cek apakah user sudah terverifikasi
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email sudah terverifikasi" },
        { status: 400 },
      );
    }

    // Generate OTP baru
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Update OTP di database dan reset attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
        otpAttempts: 0,
        otpBlockedUntil: null,
      },
    });

    // Kirim OTP via email
    const emailService = getEmailService();
    const emailSent = await emailService.sendOTP({
      to: email,
      name: user.name,
      otp,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: "Gagal mengirim email OTP. Silakan coba lagi." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Kode OTP baru telah dikirim ke email Anda",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengirim ulang OTP" },
      { status: 500 },
    );
  }
}
