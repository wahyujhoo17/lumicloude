#!/bin/bash

# Script untuk setup database di VPS dengan aaPanel
# Jalankan script ini di VPS Anda setelah upload project

echo "🚀 LumiCloud Database Setup"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ File .env tidak ditemukan!${NC}"
    echo "Copy .env.example ke .env dan isi credentials database"
    exit 1
fi

echo -e "${YELLOW}📋 Step 1: Install Dependencies${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Gagal install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}📋 Step 2: Generate Prisma Client${NC}"
npx prisma generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Gagal generate Prisma Client${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

echo -e "${YELLOW}📋 Step 3: Test Database Connection${NC}"
npx prisma db execute --stdin <<EOF
SELECT 1;
EOF
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Koneksi database gagal!${NC}"
    echo "Periksa credentials di .env:"
    echo "- DATABASE_URL"
    echo "- Username: Lumicloud"
    echo "- Password: 6N7SGc72AW6Nw"
    echo "- Database: lumicloud"
    exit 1
fi
echo -e "${GREEN}✅ Database connection OK${NC}"
echo ""

echo -e "${YELLOW}📋 Step 4: Run Database Migrations${NC}"
npx prisma migrate deploy
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Migrasi gagal!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

echo -e "${YELLOW}📋 Step 5: Seed Database${NC}"
npm run db:seed
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Seeding gagal!${NC}"
    echo "Cek file prisma/seed.ts"
    exit 1
fi
echo -e "${GREEN}✅ Database seeded${NC}"
echo ""

echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "📝 Test Users Created:"
echo "   Admin: admin@lumicloud.com / admin123"
echo "   Test: test@lumicloud.com / test123"
echo ""
echo "🔧 Next Steps:"
echo "   1. Build aplikasi: npm run build"
echo "   2. Start server: npm start"
echo "   3. Atau dengan PM2: pm2 start ecosystem.config.js"
echo ""
