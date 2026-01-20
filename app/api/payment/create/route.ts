import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getIPaymuService } from "@/lib/ipaymu";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      planName,
      planType,
      price,
      duration = 1,
      planId,
      metadata,
    } = await req.json();

    if (!planName || !planType || !price) {
      return NextResponse.json(
        { error: "Data order tidak lengkap" },
        { status: 400 },
      );
    }

    // Ambil data user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // Buat order baru
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        planId: planId || null,
        planName,
        planType,
        price,
        duration,
        status: "PENDING",
        metadata: metadata || {},
      },
    });

    // Buat pembayaran di iPaymu dengan redirect
    const ipaymu = getIPaymuService();
    const paymentResult = await ipaymu.createPaymentWithRedirect({
      orderId: order.id,
      amount: price,
      buyerName: user.name,
      buyerEmail: user.email,
      buyerPhone: user.phone || "0000000000",
      product: [`${planName} Business Lumicloude - ${duration} Bulan`],
      qty: [1],
      price: [price],
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${order.id}`,
      notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
    });

    if (!paymentResult.success) {
      // Update order status jadi FAILED
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json({ error: paymentResult.error }, { status: 500 });
    }

    console.log(
      "iPaymu payment redirect result:",
      JSON.stringify(paymentResult, null, 2),
    );

    // Extract payment data dari response redirect
    const paymentData = paymentResult.data?.Data || paymentResult.data;
    const sessionId = paymentData?.SessionID || paymentData?.SessionId;
    const redirectUrl = paymentData?.Url;

    if (!redirectUrl) {
      console.error("Redirect URL not found in response:", paymentData);
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: "Redirect URL tidak ditemukan" },
        { status: 500 },
      );
    }

    // Update order dengan payment info
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: sessionId,
        paymentUrl: redirectUrl,
        status: "PROCESSING",
        metadata: {
          ...(metadata || {}),
          paymentDetails: {
            sessionId: sessionId,
            redirectUrl: redirectUrl,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      paymentUrl: redirectUrl,
      paymentDetails: paymentData,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat pembayaran" },
      { status: 500 },
    );
  }
}
