# 🌟 LumiCloud - Cloud Hosting Platform

Platform hosting modern dengan payment gateway otomatis dan deployment terintegrasi menggunakan Next.js, iPaymu, dan aaPanel.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.2-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)

---

## ✨ Fitur Utama

### 🔐 Authentication & Authorization

- User registration & login dengan NextAuth.js
- JWT session management
- Password hashing dengan bcrypt
- Protected API routes

### 💳 Payment Gateway Integration

- **iPaymu** payment gateway
- Multiple payment methods (Virtual Account, QRIS, dll)
- Webhook callback handling
- Auto order status update
- Sandbox & production environment

### 📦 Order & Subscription Management

- Real-time order tracking
- Monthly/yearly subscription
- Auto-renewal system
- Payment history
- Invoice generation

### 🌐 Website Management

- Auto-create hosting account via aaPanel API
- FTP credentials generation
- SSL certificate setup
- Domain management
- Website statistics

### 📤 File Upload & Deployment

- ZIP/TAR.GZ file upload
- Auto-extract to server
- Permission management
- Deploy to live server
- File history tracking

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env dengan credentials Anda

# 3. Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# 4. Run development
npm run dev
```

✅ Aplikasi berjalan di http://localhost:3000

**📖 Dokumentasi lengkap:** [QUICKSTART.md](./QUICKSTART.md)

---

## 🏗️ Tech Stack

| Technology        | Purpose                           |
| ----------------- | --------------------------------- |
| **Next.js 14**    | React framework dengan API Routes |
| **TypeScript**    | Type-safe development             |
| **Prisma ORM**    | Database toolkit                  |
| **PostgreSQL**    | Relational database               |
| **NextAuth.js**   | Authentication                    |
| **iPaymu**        | Payment gateway Indonesia         |
| **aaPanel**       | Web hosting panel                 |
| **Tailwind CSS**  | Utility-first CSS                 |
| **Framer Motion** | Animation library                 |

---

## 📁 Struktur Project

```
lumicloud/
├── app/
│   ├── api/              # API endpoints
│   │   ├── auth/         # Authentication
│   │   ├── payment/      # Payment processing
│   │   ├── orders/       # Order management
│   │   ├── website/      # Website operations
│   │   └── upload/       # File upload
│   ├── layout.tsx
│   └── page.tsx
├── components/           # React components
├── lib/                  # Services & utilities
│   ├── prisma.ts        # Database client
│   ├── auth.ts          # Auth config
│   ├── ipaymu.ts        # Payment service
│   └── aapanel.ts       # Hosting service
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeder
└── types/               # TypeScript types
```

---

## 🔄 Flow Diagram

### Payment Flow

```
User → Pilih Paket → API Create Payment → iPaymu
→ User Bayar → Webhook Callback → Update Database
→ Create Subscription → Email Notification
```

### Deployment Flow

```
User → Upload ZIP → API Save File → Create Website (aaPanel)
→ Upload to FTP → Extract Files → Set Permissions → Live! 🚀
```

**Detail:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📚 Dokumentasi

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide (5 menit)
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Setup lengkap step-by-step
- **[BACKEND_README.md](./BACKEND_README.md)** - API documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture

---

## 🔐 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# iPaymu Payment Gateway
IPAYMU_VA="your-va-number"
IPAYMU_API_KEY="your-api-key"
IPAYMU_ENV="sandbox" # or "production"

# aaPanel
AAPANEL_URL="https://your-panel.com:8888"
AAPANEL_API_KEY="your-api-key"
```

**Template:** [.env.example](./.env.example)

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

---

## 📊 Database Schema

### Models

- **User** - User accounts
- **Order** - Purchase orders
- **Subscription** - Active subscriptions
- **Website** - Hosted websites
- **FileUpload** - Uploaded files

**ERD:** [ARCHITECTURE.md#database](./ARCHITECTURE.md)

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/signin` - Login

### Payment

- `POST /api/payment/create` - Create payment
- `POST /api/payment/callback` - Payment webhook

### Orders & Subscription

- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Order detail
- `GET /api/dashboard` - User dashboard

### Website Management

- `POST /api/website/create` - Create website
- `POST /api/website/deploy` - Deploy files

### File Upload

- `POST /api/upload` - Upload file
- `GET /api/upload?websiteId=xxx` - List files

**API Docs:** [BACKEND_README.md](./BACKEND_README.md)

---

## 🧪 Testing

### Manual Testing

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'

# Login
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### iPaymu Sandbox

- URL: https://sandbox.ipaymu.com
- Test cards & VAs available

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### VPS (Manual)

```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "lumicloud" -- start
```

---

## 🔧 Configuration

### iPaymu Setup

1. Daftar di https://my.ipaymu.com (production) atau https://sandbox.ipaymu.com (testing)
2. Get VA & API Key dari dashboard
3. Set callback URL: `https://yourdomain.com/api/payment/callback`
4. Update `.env` dengan credentials

### aaPanel Setup

1. Install aaPanel di VPS
2. Enable API di Panel Settings
3. Create API Key
4. Update `.env` dengan URL & API Key

**Detail:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🐛 Troubleshooting

| Problem                | Solution                              |
| ---------------------- | ------------------------------------- |
| Prisma error           | `npm run db:generate`                 |
| Database error         | Check `DATABASE_URL`                  |
| iPaymu signature error | Verify `IPAYMU_VA` & `IPAYMU_API_KEY` |
| aaPanel connection     | Check firewall & API key              |
| NextAuth error         | Generate new `NEXTAUTH_SECRET`        |

**More:** [SETUP_GUIDE.md#troubleshooting](./SETUP_GUIDE.md)

---

## 📈 Roadmap

- [ ] Email notifications (payment success, renewal reminder)
- [ ] Admin dashboard
- [ ] Billing invoices
- [ ] Multiple payment gateways
- [ ] Auto-renewal system
- [ ] Usage monitoring
- [ ] CDN integration
- [ ] Backup management

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

## 📄 License

MIT License - feel free to use for commercial projects

---

## 👨‍💻 Author

**LumiCloud Team**

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [iPaymu](https://ipaymu.com/)
- [aaPanel](https://www.aapanel.com/)

---

**⚡ Built with Next.js 14 & TypeScript**

**🚀 Ready for Production!**
