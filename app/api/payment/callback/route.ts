import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIPaymuService } from "@/lib/ipaymu";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get("signature") || "";

    // Verifikasi signature dari iPaymu
    const ipaymu = getIPaymuService();
    const isValid = ipaymu.verifyCallback(signature, body);

    if (!isValid) {
      console.error("Invalid signature from iPaymu");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const {
      trx_id,
      status,
      status_code,
      reference_id, // order ID kita
    } = body;

    // Cari order berdasarkan reference_id
    const order = await prisma.order.findFirst({
      where: { id: reference_id },
      include: { user: true },
    });

    if (!order) {
      console.error("Order not found:", reference_id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Status code iPaymu:
    // 1 = berhasil (paid)
    // 0 = pending
    // -1 = expired
    // -2 = failed

    if (status_code === 1) {
      // Payment berhasil
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "COMPLETED",
          paidAt: new Date(),
        },
      });

      // Buat subscription
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 bulan

      await prisma.subscription.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          planName: order.planName,
          planType: order.planType,
          status: "ACTIVE",
          startDate: new Date(),
          endDate: endDate,
          autoRenew: true,
        },
      });

      // TODO: Trigger aaPanel untuk create hosting account
      // Akan diimplementasikan di API aaPanel

      console.log("Payment completed for order:", order.id);
    } else if (status_code === -1) {
      // Expired
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "EXPIRED" },
      });
    } else if (status_code === -2) {
      // Failed
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
