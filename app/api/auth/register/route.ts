import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getEmailService, generateOTP, getOTPExpiry } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone } = await req.json();

    console.log("=== REGISTER API CALLED ===");
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("Phone:", phone);

    // Validasi input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, dan nama harus diisi" },
        { status: 400 },
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 },
      );
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Buat user baru dengan OTP
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        emailVerified: false,
        otp,
        otpExpiry,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Kirim OTP via email
    console.log("Sending OTP email...");
    const emailService = getEmailService();
    const emailSent = await emailService.sendOTP({
      to: email,
      name,
      otp,
    });
    console.log("Email sent status:", emailSent);

    if (!emailSent) {
      console.error("Failed to send OTP email to:", email);
      // Tetap return success karena user sudah dibuat, tapi beri warning
      return NextResponse.json(
        {
          message:
            "Registrasi berhasil, tetapi gagal mengirim email OTP. Silakan hubungi support.",
          user,
          warning: "Email OTP tidak terkirim",
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        message:
          "Registrasi berhasil! Silakan cek email Anda untuk kode verifikasi OTP.",
        user,
        otpSent: true,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 },
    );
  }
}
