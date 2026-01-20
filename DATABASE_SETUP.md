# Panduan Koneksi Database aaPanel PostgreSQL

## 🔌 Koneksi Database dari aaPanel ke Aplikasi

### Informasi Database Anda (dari screenshot):

- **Database name**: `lumicloud`
- **Username**: `Lumicloud`
- **Password**: `6N7SGc72AW6Nw` (sesuaikan dengan password lengkap Anda)
- **Host**: `localhost` (karena database di server yang sama)
- **Port**: `5432` (default PostgreSQL)

---

## 📝 Step by Step Setup

### 1. Update File `.env`

Sudah saya update file `.env` dengan credentials dari aaPanel:

```env
DATABASE_URL="postgresql://Lumicloud:6N7SGc72AW6Nw@localhost:5432/lumicloud"
```

⚠️ **PENTING**: Ganti password dengan password lengkap dari aaPanel (yang di screenshot ada "...")

---

### 2. Upload Project ke VPS

**Via Git (Recommended):**

```bash
# Di VPS
cd /var/www
git clone <repository-url> lumicloud
cd lumicloud
```

**Via SFTP/FileZilla:**

- Upload semua file project ke `/var/www/lumicloud/`
- Pastikan file `.env` ikut terupload dengan credentials yang benar

---

### 3. Jalankan Setup Database

Saya sudah buat script otomatis untuk setup database. Di VPS, jalankan:

```bash
cd /var/www/lumicloud

# Buat script executable
chmod +x setup-database.sh

# Jalankan setup
./setup-database.sh
```

Script ini akan otomatis:

- ✅ Install dependencies
- ✅ Generate Prisma Client
- ✅ Test koneksi database
- ✅ Jalankan migrations (buat tabel)
- ✅ Seed database (isi data awal)

---

### 4. Manual Setup (Alternatif)

Jika tidak mau pakai script, bisa manual:

```bash
cd /var/www/lumicloud

# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Test koneksi database
npx prisma db execute --stdin <<EOF
SELECT version();
EOF

# 4. Jalankan migrations
npx prisma migrate deploy

# 5. Seed database
npm run db:seed
```

---

## 🔍 Verifikasi Setup

### Check Tabel Database via aaPanel

1. Login ke **aaPanel** → **Database** → **PostgreSQL**
2. Klik **Adminer** atau **phpPgAdmin** di database `lumicloud`
3. Lihat apakah tabel sudah terbuat:
   - ✅ User
   - ✅ Order
   - ✅ Subscription
   - ✅ Website
   - ✅ FileUpload

### Check Data Seeder

Cek apakah ada 2 user test:

```bash
# Di VPS
cd /var/www/lumicloud

# Query database
npx prisma studio
# Atau via psql
psql -U Lumicloud -d lumicloud -c "SELECT id, email, name FROM \"User\";"
```

Seharusnya ada:

- `admin@lumicloud.com` (Admin User)
- `test@lumicloud.com` (Test User)

---

## 🐛 Troubleshooting

### Error: "Authentication failed for user Lumicloud"

**Solusi:**

1. Pastikan password di `.env` benar (copy full password dari aaPanel)
2. Check di aaPanel: **Database** → **PostgreSQL** → klik **Password** untuk lihat password lengkap

```bash
# Test koneksi manual
psql -U Lumicloud -d lumicloud -h localhost
# Masukkan password ketika diminta
```

### Error: "database does not exist"

**Solusi:**
Database sudah dibuat via aaPanel, tapi pastikan namanya persis `lumicloud` (case-sensitive).

```bash
# List semua database
psql -U Lumicloud -l
```

### Error: "peer authentication failed"

**Solusi:**
PostgreSQL di aaPanel biasanya sudah dikonfigurasi dengan MD5 auth. Tapi jika error, edit `pg_hba.conf`:

```bash
# Edit file
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Pastikan ada baris ini (bukan 'peer', tapi 'md5'):
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Error: "Migration failed"

**Solusi:**
Hapus migration history dan jalankan ulang:

```bash
cd /var/www/lumicloud

# Hapus folder migrations lama (backup dulu!)
rm -rf prisma/migrations

# Generate migration baru
npx prisma migrate dev --name init

# Atau deploy langsung
npx prisma migrate deploy
```

### Error: "Prisma Client not generated"

**Solusi:**

```bash
cd /var/www/lumicloud

# Generate ulang
npx prisma generate

# Install ulang dependencies jika perlu
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

---

## 📊 Monitoring Database

### Via aaPanel

1. **aaPanel** → **Database** → **PostgreSQL**
2. Lihat resource usage, connections, dll

### Via Command Line

```bash
# Check active connections
psql -U Lumicloud -d lumicloud -c "SELECT * FROM pg_stat_activity WHERE datname = 'lumicloud';"

# Check database size
psql -U Lumicloud -d lumicloud -c "SELECT pg_size_pretty(pg_database_size('lumicloud'));"

# List all tables
psql -U Lumicloud -d lumicloud -c "\dt"

# Count records per table
psql -U Lumicloud -d lumicloud -c "SELECT 'User' as table_name, COUNT(*) FROM \"User\" UNION ALL SELECT 'Order', COUNT(*) FROM \"Order\";"
```

---

## 🔐 Security Best Practices

1. **Jangan commit file .env ke Git**

   ```bash
   # Pastikan .env ada di .gitignore
   echo ".env" >> .gitignore
   ```

2. **Gunakan password yang kuat**
   - aaPanel sudah generate password kuat otomatis ✅

3. **Backup database berkala**

   ```bash
   # Manual backup
   pg_dump -U Lumicloud lumicloud > backup_$(date +%Y%m%d).sql

   # Setup cronjob untuk auto backup
   crontab -e
   # Tambahkan: 0 2 * * * pg_dump -U Lumicloud lumicloud > /backups/lumicloud_$(date +\%Y\%m\%d).sql
   ```

4. **Restrict database access**
   - Di aaPanel, set database hanya bisa diakses dari `localhost` ✅

---

## 🚀 Next Steps Setelah Database Setup

1. **Build aplikasi**

   ```bash
   npm run build
   ```

2. **Test aplikasi**

   ```bash
   npm start
   # Atau development mode
   npm run dev
   ```

3. **Setup PM2 untuk production**

   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   ```

4. **Setup Nginx reverse proxy**
   - Ikuti panduan di `DEPLOYMENT_GUIDE.md`

---

## 📞 Quick Commands Cheat Sheet

```bash
# Setup database (all in one)
./setup-database.sh

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed

# Reset database (DANGER: hapus semua data!)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Test koneksi
psql -U Lumicloud -d lumicloud -h localhost
```

---

**Selamat! Database Anda siap digunakan! 🎉**

Jika ada error, check:

1. File `.env` - pastikan credentials benar
2. PostgreSQL service running: `systemctl status postgresql`
3. Network firewall tidak block port 5432
4. User `Lumicloud` punya permission ke database `lumicloud`
