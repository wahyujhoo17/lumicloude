# ⚡ Quick Start Guide - LumiCloud Backend

## 🎯 Ringkasan Cepat

Backend untuk aplikasi hosting LumiCloud dengan fitur:

- ✅ Authentication (Register/Login)
- ✅ Payment Gateway iPaymu
- ✅ Order & Subscription Management
- ✅ File Upload & Deploy
- ✅ aaPanel Integration

---

## 🚀 Install & Run (5 Menit)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
# Copy template
cp .env.example .env

# Edit .env dan isi:
# - DATABASE_URL (PostgreSQL)
# - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
# - IPAYMU_VA & IPAYMU_API_KEY (dari dashboard iPaymu)
# - AAPANEL_URL & AAPANEL_API_KEY (dari aaPanel)
```

### 3. Generate Prisma & Run Migration

```bash
npm run db:generate
npm run db:migrate
```

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

✅ **Done!** Aplikasi berjalan di http://localhost:3000

---

## 📝 Quick Test

### Test Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

---

## 📚 Dokumentasi Lengkap

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Setup detail step-by-step
- **[BACKEND_README.md](./BACKEND_README.md)** - API documentation lengkap
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture & flow

---

## 🔑 Kredensial Default (Setelah Seed)

```
Admin:
Email: admin@lumicloud.com
Password: admin123

Test User:
Email: test@lumicloud.com
Password: test123
```

---

## 📁 Struktur Utama

```
app/api/          → API endpoints
lib/              → Services & utilities
prisma/           → Database schema & migrations
components/       → React components
```

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Build
npm run build            # Build for production
npm run start            # Start production server
```

---

## ⚙️ API Endpoints

### Authentication

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/signin` - Login

### Payment

- `POST /api/payment/create` - Buat pembayaran
- `POST /api/payment/callback` - Webhook dari iPaymu

### Orders

- `GET /api/orders` - List semua order
- `GET /api/orders/:id` - Detail order

### Website

- `POST /api/website/create` - Buat website di aaPanel
- `POST /api/website/deploy` - Deploy file ke server

### Upload

- `POST /api/upload` - Upload file website
- `GET /api/upload?websiteId=xxx` - List files

### Dashboard

- `GET /api/dashboard` - Get user stats & data

---

## 💡 Tips

1. **iPaymu Sandbox**: Gunakan environment `sandbox` untuk testing
2. **Database**: Pakai Prisma Studio untuk inspect data (`npm run db:studio`)
3. **aaPanel**: Setup API key dulu sebelum create website
4. **File Upload**: Max 50MB per file
5. **Environment**: Jangan commit file `.env`!

---

## 🐛 Troubleshooting

| Problem                  | Solution                             |
| ------------------------ | ------------------------------------ |
| Database error           | Cek `DATABASE_URL` di .env           |
| Prisma error             | Run `npm run db:generate`            |
| iPaymu signature error   | Cek `IPAYMU_VA` dan `IPAYMU_API_KEY` |
| aaPanel connection error | Cek `AAPANEL_URL` accessible         |
| NextAuth error           | Generate new `NEXTAUTH_SECRET`       |

---

## 📞 Support

Jika ada masalah:

1. Cek error di terminal
2. Baca dokumentasi lengkap
3. Cek logs di `npm run db:studio`

---

**Happy Coding! 🚀**
