import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEmailService } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email harus diisi" }, { status: 400 });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Untuk keamanan, jangan beri tahu bahwa email tidak terdaftar
      return NextResponse.json({
        message: "Jika email terdaftar, link reset password akan dikirim",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token berlaku 1 jam

    // Update user dengan reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Generate reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Kirim email reset password
    const emailService = getEmailService();
    const emailSent = await emailService.sendForgotPassword({
      to: user.email,
      name: user.name,
      resetLink,
    });

    if (!emailSent) {
      console.error("Failed to send reset password email");
      return NextResponse.json(
        { error: "Gagal mengirim email reset password" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Link reset password telah dikirim ke email Anda",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal" },
      { status: 500 },
    );
  }
}
