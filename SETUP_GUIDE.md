# 🚀 Cara Menjalankan Backend LumiCloud

## ✅ Checklist Sebelum Mulai

- [x] Node.js installed
- [x] PostgreSQL installed & running
- [ ] Account iPaymu (sandbox/production)
- [ ] aaPanel installed & configured

## 📝 Step-by-Step Setup

### 1. Clone & Install Dependencies

```bash
cd /Users/wahyujhoo/Documents/Next\ Js/lumicloud
npm install
```

### 2. Setup Database

#### Option A: Gunakan Prisma Dev (Recommended)

```bash
npx prisma dev
```

#### Option B: Gunakan PostgreSQL Lokal

```bash
# Install PostgreSQL jika belum
brew install postgresql@14
brew services start postgresql@14

# Buat database
createdb lumicloud

# Update DATABASE_URL di .env
DATABASE_URL="postgresql://username:password@localhost:5432/lumicloud"
```

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy hasilnya dan paste ke `.env` pada `NEXTAUTH_SECRET`

### 4. Setup iPaymu

#### Sandbox (Testing)

1. Daftar di https://sandbox.ipaymu.com
2. Login → Dashboard → Integration
3. Copy **VA Number** dan **API Key**
4. Update di `.env`:

```env
IPAYMU_VA=1179001234567890
IPAYMU_API_KEY=QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfgh
IPAYMU_ENV=sandbox
```

#### Production (Live)

1. Daftar di https://my.ipaymu.com
2. Lengkapi verifikasi KYC
3. Get VA & API Key dari dashboard
4. Update `.env` dengan `IPAYMU_ENV=production`

### 5. Setup aaPanel

#### Install aaPanel

```bash
# Di VPS Ubuntu/Debian
wget -O install.sh http://www.aapanel.com/script/install-ubuntu_6.0_en.sh
sudo bash install.sh aapanel
```

#### Enable API

1. Login ke aaPanel: `http://your-ip:8888`
2. Go to **Panel Settings** → **API Interface**
3. Enable API
4. Create API Key
5. Update di `.env`:

```env
AAPANEL_URL=http://your-vps-ip:8888
AAPANEL_API_KEY=your-generated-api-key
```

### 6. Run Database Migration

```bash
npx prisma migrate dev --name init
```

### 7. (Optional) Seed Database

Buat file `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@lumicloud.com",
      password: hashedPassword,
      name: "Admin LumiCloud",
      phone: "08123456789",
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:

```bash
npx tsx prisma/seed.ts
```

### 8. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di: http://localhost:3000

---

## 🧪 Testing API

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "08123456789"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create Payment

```bash
curl -X POST http://localhost:3000/api/payment/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "planName": "Business",
    "planType": "hosting",
    "price": 30000,
    "metadata": {
      "domain": "example.com"
    }
  }'
```

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Cek apakah PostgreSQL running
brew services list

# Restart PostgreSQL
brew services restart postgresql@14

# Test connection
psql -d lumicloud
```

### Prisma Generate Error

```bash
# Clear generated files
rm -rf node_modules/@prisma/client
rm -rf node_modules/.prisma

# Regenerate
npx prisma generate
```

### iPaymu Signature Error

- Pastikan `IPAYMU_VA` dan `IPAYMU_API_KEY` benar
- Cek environment (`sandbox` vs `production`)
- Periksa timestamp di request header

### aaPanel Connection Error

- Pastikan aaPanel accessible dari aplikasi
- Cek firewall allow port 8888
- Verifikasi API Key masih valid

---

## 📚 Dokumentasi Lengkap

Lihat [BACKEND_README.md](./BACKEND_README.md) untuk:

- API endpoints lengkap
- Database schema detail
- Payment flow
- Security best practices

---

## 🎯 Next Steps

1. ✅ Setup semua environment variables
2. ✅ Test register & login
3. ✅ Test create payment di sandbox iPaymu
4. ✅ Setup webhook callback URL di iPaymu dashboard
5. ✅ Test create website di aaPanel
6. ✅ Test upload & deploy
7. 🚀 Deploy to production (Vercel/VPS)

---

Jika ada masalah, cek error di terminal atau contact support!
