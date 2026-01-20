import { NextRequest, NextResponse } from "next/server";
import { getIPaymuService } from "@/lib/ipaymu";

export async function GET(request: NextRequest) {
  try {
    const ipaymu = getIPaymuService();
    const channelsData = await ipaymu.getPaymentChannels();

    // Transform data to match frontend format
    const paymentMethods = [];

    if (channelsData.Data && Array.isArray(channelsData.Data)) {
      for (const group of channelsData.Data) {
        if (group.Channels && Array.isArray(group.Channels)) {
          for (const channel of group.Channels) {
            let category = "bank"; // default

            // Map code to category
            switch (group.Code) {
              case "va":
                category = "bank";
                break;
              case "cstore":
                category = "retail";
                break;
              case "qris":
                category = "qris";
                break;
              case "cc":
                category = "bank";
                break;
              case "ewallet-asia":
                category = "ewallet";
                break;
              case "paylater":
                category = "ewallet";
                break;
              default:
                category = "bank";
            }

            paymentMethods.push({
              id: channel.Code,
              name: channel.Name,
              channel: channel.Code,
              description: channel.Description,
              enabled: channel.FeatureStatus === "active",
              logo: channel.Logo || "",
              category: category,
              fee: channel.TransactionFee,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: paymentMethods,
    });
  } catch (error: any) {
    console.error("Error in payment channels API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch payment channels",
      },
      { status: 500 },
    );
  }
}
