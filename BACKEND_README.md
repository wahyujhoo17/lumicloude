# LumiCloud Backend API Documentation

Backend untuk aplikasi hosting LumiCloud menggunakan Next.js API Routes dengan integrasi iPaymu payment gateway dan aaPanel.

## 🚀 Tech Stack

- **Framework**: Next.js 14 API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Payment Gateway**: iPaymu
- **Hosting Panel**: aaPanel API
- **File Upload**: Multer

## 📁 Struktur Backend

```
app/api/
├── auth/
│   ├── [...nextauth]/route.ts  # NextAuth handler
│   └── register/route.ts       # User registration
├── payment/
│   ├── create/route.ts         # Buat transaksi pembayaran
│   └── callback/route.ts       # Webhook dari iPaymu
├── orders/
│   ├── route.ts                # List semua order user
│   └── [id]/route.ts           # Detail order by ID
├── upload/route.ts             # Upload file website
└── website/
    ├── create/route.ts         # Buat website di aaPanel
    └── deploy/route.ts         # Deploy file ke aaPanel

lib/
├── prisma.ts                   # Prisma client instance
├── auth.ts                     # NextAuth configuration
├── ipaymu.ts                   # iPaymu service
└── aapanel.ts                  # aaPanel service
```

## 🗄️ Database Schema

### User

- Email, password, nama, phone
- Relasi: orders, subscriptions, websites

### Order

- Info pembelian paket hosting
- Status: PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, EXPIRED
- Payment info dari iPaymu

### Subscription

- Langganan hosting aktif
- Auto-renewal management
- Start date & end date

### Website

- Domain, FTP credentials
- aaPanel site ID
- Status: PENDING, ACTIVE, SUSPENDED, DELETED

### FileUpload

- History file yang di-upload user
- Metadata file (size, type, path)

## 🔐 Authentication

### Register

```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "08123456789"
}
```

### Login

```bash
POST /api/auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 💳 Payment Flow

### 1. Create Payment

```bash
POST /api/payment/create
Headers: Authorization: Bearer <token>
{
  "planName": "Business",
  "planType": "hosting",
  "price": 30000,
  "metadata": {
    "domain": "example.com"
  }
}

Response:
{
  "success": true,
  "order": {...},
  "paymentUrl": "https://sandbox.ipaymu.com/payment/..."
}
```

### 2. User Membayar

- Redirect user ke `paymentUrl`
- User memilih metode pembayaran (VA BCA, Mandiri, dll)
- User menyelesaikan pembayaran

### 3. Payment Callback (Webhook)

```bash
POST /api/payment/callback
Headers: signature: <ipaymu-signature>
Body: {
  "trx_id": "...",
  "status": 1,
  "status_code": 1,
  "reference_id": "order-id"
}
```

**Status Codes:**

- `1` = Berhasil (COMPLETED)
- `0` = Pending
- `-1` = Expired
- `-2` = Failed

## 🌐 Website Management

### Create Website

```bash
POST /api/website/create
Headers: Authorization: Bearer <token>
{
  "subscriptionId": "sub-id",
  "domain": "example.com"
}

Response:
{
  "success": true,
  "website": {
    "id": "...",
    "domain": "example.com",
    "ftpUsername": "ftp_user",
    "ftpPassword": "ftp_pass",
    "status": "ACTIVE"
  }
}
```

### Upload & Deploy Website

```bash
# 1. Upload file
POST /api/upload
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
{
  "file": <zip-file>,
  "websiteId": "website-id"
}

# 2. Deploy to aaPanel
POST /api/website/deploy
Headers: Authorization: Bearer <token>
{
  "websiteId": "website-id",
  "fileUploadId": "file-id"
}
```

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` ke `.env` dan isi:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/lumicloud"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
IPAYMU_VA="your-va"
IPAYMU_API_KEY="your-api-key"
IPAYMU_ENV="sandbox"
AAPANEL_URL="https://your-panel.com:8888"
AAPANEL_API_KEY="your-api-key"
```

### 3. Generate Prisma Client & Run Migration

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 5. Run Development Server

```bash
npm run dev
```

## 🔧 aaPanel Configuration

### Enable API Access

1. Login ke aaPanel
2. Go to **API** section
3. Click **Create API Key**
4. Simpan API Key ke `.env`

### API Endpoints yang Digunakan

- `POST /api/website/create` - Buat website baru
- `GET /api/website/get` - Info website
- `POST /api/website/delete` - Hapus website
- `POST /api/files/upload` - Upload file
- `POST /api/files/extract` - Extract ZIP
- `POST /api/files/permission` - Set permission

## 💰 iPaymu Configuration

### Sandbox Testing

1. Daftar di https://sandbox.ipaymu.com
2. Get VA dan API Key dari dashboard
3. Set `IPAYMU_ENV=sandbox`

### Production

1. Daftar di https://my.ipaymu.com
2. Verifikasi akun
3. Get VA dan API Key
4. Set `IPAYMU_ENV=production`

### Callback URL Setup

Set di dashboard iPaymu:

```
https://yourdomain.com/api/payment/callback
```

## 🧪 Testing Payment

### Test Card Numbers (Sandbox)

- Success: `4111 1111 1111 1111`
- Failed: `4000 0000 0000 0002`

## 📝 Order Status Flow

```
PENDING → PROCESSING → COMPLETED
                    ↓
                FAILED
                    ↓
                CANCELLED
                    ↓
                EXPIRED
```

## 🔄 Auto-Billing/Renewal

Untuk implementasi auto-billing bulanan:

1. Buat cron job yang jalan setiap hari
2. Cek subscription yang akan expired dalam 3 hari
3. Buat order baru otomatis
4. Kirim email reminder ke user
5. Jika tidak bayar dalam 3 hari, suspend website

## 🚨 Error Handling

Semua API routes menggunakan try-catch dan return:

```json
{
  "error": "Error message",
  "status": 400/404/500
}
```

## 📧 Email Notifications

Implementasi email notifications untuk:

- Registration success
- Payment success
- Payment failed
- Subscription reminder
- Website created

## 🔐 Security

- ✅ Password hashing dengan bcrypt
- ✅ JWT tokens dengan NextAuth
- ✅ API signature verification (iPaymu)
- ✅ File upload validation (type & size)
- ✅ User authorization checks
- ✅ CORS configuration

## 📊 Monitoring

Recommended tools:

- Sentry untuk error tracking
- Vercel Analytics
- Database monitoring dengan Prisma Studio

---

**Dibuat untuk LumiCloud Hosting Platform**
