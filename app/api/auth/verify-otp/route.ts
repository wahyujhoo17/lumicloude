import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmailService } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    // Validasi input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email dan OTP harus diisi" },
        { status: 400 },
      );
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
        { error: "Email sudah terverifikasi sebelumnya" },
        { status: 400 },
      );
    }

    // Cek apakah user sedang di-block karena terlalu banyak attempts
    if (user.otpBlockedUntil && new Date() < user.otpBlockedUntil) {
      const remainingMinutes = Math.ceil(
        (user.otpBlockedUntil.getTime() - new Date().getTime()) / 60000,
      );
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${remainingMinutes} menit.`,
        },
        { status: 429 },
      );
    }

    // Cek apakah OTP valid
    if (!user.otp || user.otp !== otp) {
      // Increment failed attempts
      const newAttempts = user.otpAttempts + 1;
      const maxAttempts = 5;

      if (newAttempts >= maxAttempts) {
        // Block user selama 15 menit
        const blockUntil = new Date();
        blockUntil.setMinutes(blockUntil.getMinutes() + 15);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            otpAttempts: newAttempts,
            otpBlockedUntil: blockUntil,
          },
        });

        return NextResponse.json(
          {
            error:
              "Kode OTP tidak valid. Anda telah mencapai batas maksimal percobaan. Akun diblokir selama 15 menit.",
          },
          { status: 429 },
        );
      }

      // Update attempts
      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: newAttempts },
      });

      return NextResponse.json(
        {
          error: `Kode OTP tidak valid. Sisa percobaan: ${maxAttempts - newAttempts}`,
        },
        { status: 400 },
      );
    }

    // Cek apakah OTP sudah expired
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return NextResponse.json(
        { error: "Kode OTP sudah kadaluarsa. Silakan minta kode baru." },
        { status: 400 },
      );
    }

    // Update user menjadi verified dan hapus OTP + reset attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiry: null,
        otpAttempts: 0,
        otpBlockedUntil: null,
      },
    });

    // Kirim email welcome
    const emailService = getEmailService();
    await emailService.sendWelcome(user.email, user.name);

    return NextResponse.json(
      {
        message: "Email berhasil diverifikasi!",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat verifikasi OTP" },
      { status: 500 },
    );
  }
}
