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
      paymentMethod,
      paymentChannel,
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
        planName,
        planType,
        price,
        status: "PENDING",
        metadata: metadata || {},
      },
    });

    // Buat pembayaran di iPaymu
    const ipaymu = getIPaymuService();
    const paymentResult = await ipaymu.createPayment({
      orderId: order.id,
      amount: price,
      buyerName: user.name,
      buyerEmail: user.email,
      buyerPhone: user.phone || "0000000000",
      product: [planName],
      qty: [1],
      price: [price],
      paymentMethod: paymentMethod || "va",
      paymentChannel: paymentChannel || "bca",
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
      "iPaymu payment result:",
      JSON.stringify(paymentResult, null, 2),
    );

    // Extract payment data dengan fallback
    const paymentData = paymentResult.data?.Data || paymentResult.data;
    const transactionId =
      paymentData?.TransactionId || paymentData?.SessionID || order.id;

    // Untuk payment direct, tidak ada URL redirect
    // Kita redirect ke halaman payment instruction kita sendiri
    const paymentUrl = `/payment/instruction/${order.id}`;

    // Update order dengan payment info
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: String(transactionId),
        paymentUrl: paymentUrl,
        status: "PROCESSING",
        metadata: {
          ...(metadata || {}),
          paymentDetails: {
            paymentNo: paymentData?.PaymentNo,
            channel: paymentData?.Channel,
            via: paymentData?.Via,
            total: paymentData?.Total,
            fee: paymentData?.Fee,
            expired: paymentData?.Expired,
            sessionId: paymentData?.SessionId,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      paymentUrl: paymentUrl,
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
