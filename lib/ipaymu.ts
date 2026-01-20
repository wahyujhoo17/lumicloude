import crypto from "crypto";
import axios from "axios";

interface IPaymuConfig {
  va: string;
  apiKey: string;
  isProduction: boolean;
}

interface CreatePaymentParams {
  orderId: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  product: string[];
  qty: number[];
  price: number[];
  returnUrl: string;
  notifyUrl: string;
  paymentMethod?: string;
  paymentChannel?: string;
}

export class IPaymuService {
  private va: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(config: IPaymuConfig) {
    this.va = config.va;
    this.apiKey = config.apiKey;
    this.baseUrl = config.isProduction
      ? "https://my.ipaymu.com/api/v2"
      : "https://sandbox.ipaymu.com/api/v2";
  }

  /**
   * Generate signature untuk iPaymu
   * Format dari dokumentasi resmi:
   * 1. bodyHash = SHA256(body_json_string)
   * 2. stringToSign = "POST:va:bodyHash:apiKey"
   * 3. signature = HMAC-SHA256(apiKey, stringToSign)
   */
  private generateSignature(body: any, method: string): string {
    // Step 1: Hash body dengan SHA256 (bukan HMAC)
    const bodyJson = JSON.stringify(body);
    const bodyHash = crypto.createHash("sha256").update(bodyJson).digest("hex");

    // Step 2: Buat string to sign
    const stringToSign = `${method}:${this.va}:${bodyHash}:${this.apiKey}`;

    // Step 3: Hash string to sign dengan HMAC-SHA256
    const signature = crypto
      .createHmac("sha256", this.apiKey)
      .update(stringToSign)
      .digest("hex");

    return signature;
  }

  /**
   * Get available payment channels
   */
  async getPaymentChannels() {
    try {
      // For GET request, body is empty
      const body = {};
      const signature = this.generateSignature(body, "GET");

      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\..+/, "");

      const response = await axios.get(`${this.baseUrl}/payment-channels`, {
        headers: {
          "Content-Type": "application/json",
          signature: signature,
          va: this.va,
          timestamp: timestamp,
        },
      });

      console.log("=== iPaymu Payment Channels Response ===");
      console.log("Status:", response.status);
      console.log("Data:", JSON.stringify(response.data, null, 2));
      console.log("======================================");

      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching payment channels:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to fetch payment channels");
    }
  }

  /**
   * Buat transaksi pembayaran baru dengan redirect URL
   * Menggunakan endpoint /api/v2/payment dengan form-data
   */
  async createPaymentWithRedirect(params: CreatePaymentParams) {
    try {
      const channel = params.paymentChannel?.toLowerCase() || "bca";

      // Prepare form data - only essential parameters
      const formData = new FormData();
      formData.append(
        "product[]",
        `${params.product[0] || "Hosting"} Business Lumicloude`,
      );
      formData.append("qty[]", params.qty[0]?.toString() || "1");
      formData.append(
        "price[]",
        params.price[0]?.toString() || params.amount.toString(),
      );
      formData.append(
        "description[]",
        `${params.product[0] || "Hosting"} Business Lumicloude - Paket hosting premium dengan fitur lengkap`,
      );
      formData.append("returnUrl", params.returnUrl);
      formData.append("notifyUrl", params.notifyUrl);
      formData.append("referenceId", params.orderId);
      formData.append("buyerName", params.buyerName);
      formData.append("buyerEmail", params.buyerEmail);
      formData.append("buyerPhone", params.buyerPhone || "08123456789");

      // Add payment method and channel if specified
      if (params.paymentMethod) {
        formData.append("paymentMethod", params.paymentMethod);
      }
      if (params.paymentChannel) {
        formData.append("paymentChannel", channel);
      }

      // Generate signature for form data
      const signature = this.generateSignature({}, "POST"); // Empty body for form-data

      const response = await axios.post(`${this.baseUrl}/payment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          signature: signature,
          va: this.va,
          timestamp: new Date()
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\..+/, ""),
        },
      });

      console.log("=== iPaymu Redirect Response ===");
      console.log("Status:", response.status);
      console.log("Data:", JSON.stringify(response.data, null, 2));
      console.log("======================");

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(
        "iPaymu create payment redirect error:",
        error.response?.data || error,
      );
      return {
        success: false,
        error: error.response?.data?.Message || "Gagal membuat pembayaran",
      };
    }
  }

  /**
   * Buat transaksi pembayaran baru
   */
  async createPayment(params: CreatePaymentParams) {
    try {
      // Validate payment channel untuk sandbox
      const validChannels = ["bca", "bni"];
      const channel = params.paymentChannel?.toLowerCase() || "bca";

      if (!validChannels.includes(channel)) {
        console.warn(
          `Payment channel '${channel}' may not be supported in sandbox.`,
        );
      }

      const body = {
        name: params.buyerName,
        phone: params.buyerPhone,
        email: params.buyerEmail,
        amount: params.amount,
        notifyUrl: params.notifyUrl,
        returnUrl: params.returnUrl,
        referenceId: params.orderId,
        product: params.product,
        qty: params.qty,
        price: params.price,
        paymentMethod: params.paymentMethod || "va",
        paymentChannel: channel,
      };

      const signature = this.generateSignature(body, "POST");

      const response = await axios.post(
        `${this.baseUrl}/payment/direct`,
        body,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            va: this.va,
            signature: signature,
            timestamp: "20150201121045", // Static timestamp sesuai dokumentasi
          },
        },
      );

      console.log("=== iPaymu Response ===");
      console.log("Status:", response.status);
      console.log("Data:", JSON.stringify(response.data, null, 2));
      console.log("======================");

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(
        "iPaymu create payment error:",
        error.response?.data || error,
      );
      return {
        success: false,
        error: error.response?.data?.Message || "Gagal membuat pembayaran",
      };
    }
  }

  /**
   * Cek status transaksi
   */
  async checkTransaction(transactionId: string) {
    try {
      const body = {
        transactionId: transactionId,
      };

      const signature = this.generateSignature(body, "POST");

      const response = await axios.post(`${this.baseUrl}/transaction`, body, {
        headers: {
          "Content-Type": "application/json",
          signature: signature,
          va: this.va,
          timestamp: Date.now().toString(),
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error(
        "iPaymu check transaction error:",
        error.response?.data || error,
      );
      return {
        success: false,
        error: error.response?.data?.Message || "Gagal mengecek transaksi",
      };
    }
  }

  /**
   * Verifikasi signature dari callback iPaymu
   */
  verifyCallback(signature: string, body: any): boolean {
    const generatedSignature = this.generateSignature(body, "POST");
    return signature === generatedSignature;
  }
}

// Export singleton instance
let ipaymuInstance: IPaymuService | null = null;

export const getIPaymuService = (): IPaymuService => {
  if (!ipaymuInstance) {
    ipaymuInstance = new IPaymuService({
      va: process.env.IPAYMU_VA || "",
      apiKey: process.env.IPAYMU_API_KEY || "",
      isProduction: process.env.IPAYMU_ENV === "production",
    });
  }
  return ipaymuInstance;
};
