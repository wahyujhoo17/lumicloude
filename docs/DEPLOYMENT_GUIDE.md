# Panduan Deployment LumiCloud ke VPS

## Prerequisites

- VPS dengan minimal 2GB RAM
- Ubuntu 20.04 LTS atau lebih baru
- Domain yang sudah pointing ke IP VPS
- Akses SSH ke VPS
- aaPanel sudah terinstall (jika ingin pakai aaPanel)

## Metode Deployment

### Opsi 1: Deployment Manual dengan PM2 (Recommended)

#### 1. Persiapan VPS

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x atau lebih baru
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx
```

#### 2. Setup PostgreSQL Database

```bash
# Login sebagai postgres user
sudo -u postgres psql

# Buat database dan user
CREATE DATABASE lumicloud;
CREATE USER lumicloud_user WITH PASSWORD 'password_kuat_anda';
GRANT ALL PRIVILEGES ON DATABASE lumicloud TO lumicloud_user;

# Keluar dari psql
\q
```

#### 3. Upload Source Code

**Opsi A: Menggunakan Git (Recommended)**

```bash
# Install git jika belum ada
sudo apt install -y git

# Clone repository (jika sudah di push ke GitHub/GitLab)
cd /var/www
sudo git clone https://github.com/username/lumicloud.git
cd lumicloud

# Atau upload manual via SFTP/SCP
```

**Opsi B: Upload Manual**

```bash
# Di komputer lokal, compress project
tar -czf lumicloud.tar.gz /path/to/lumicloud --exclude=node_modules --exclude=.next

# Upload ke VPS via SCP
scp lumicloud.tar.gz user@your-vps-ip:/var/www/

# Di VPS, extract
cd /var/www
tar -xzf lumicloud.tar.gz
```

#### 4. Konfigurasi Environment Variables

```bash
cd /var/www/lumicloud

# Copy .env.example atau buat .env baru
nano .env
```

Isi file `.env` untuk production:

```env
# Database
DATABASE_URL="postgresql://lumicloud_user:password_kuat_anda@localhost:5432/lumicloud"

# NextAuth
NEXTAUTH_URL="https://lumicloud.your-domain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# iPaymu Production (ganti dengan credentials production)
IPAYMU_VA="your_production_va"
IPAYMU_API_KEY="your_production_api_key"
IPAYMU_ENV="production"

# aaPanel (sesuaikan dengan VPS Anda)
AAPANEL_URL="https://vpsdashboard.lumicloude.my.id:9000"
AAPANEL_API_KEY="your_aapanel_api_key"

# Environment
NODE_ENV="production"
```

Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

#### 5. Install Dependencies dan Build

```bash
cd /var/www/lumicloud

# Install dependencies
npm install --production=false

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database (optional)
npm run db:seed

# Build aplikasi
npm run build
```

#### 6. Setup PM2

```bash
# Buat ecosystem file untuk PM2
nano ecosystem.config.js
```

Isi file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "lumicloud",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/lumicloud",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/pm2/lumicloud-error.log",
      out_file: "/var/log/pm2/lumicloud-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
```

Jalankan aplikasi dengan PM2:

```bash
# Buat direktori log
sudo mkdir -p /var/log/pm2

# Start aplikasi
pm2 start ecosystem.config.js

# Setup PM2 startup
pm2 startup
pm2 save

# Monitor aplikasi
pm2 status
pm2 logs lumicloud
```

#### 7. Setup Nginx Reverse Proxy

```bash
# Buat file konfigurasi Nginx
sudo nano /etc/nginx/sites-available/lumicloud
```

Isi konfigurasi Nginx:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name lumicloud.your-domain.com www.lumicloud.your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name lumicloud.your-domain.com www.lumicloud.your-domain.com;

    # SSL Configuration (akan diisi oleh Certbot)
    # ssl_certificate /etc/letsencrypt/live/lumicloud.your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/lumicloud.your-domain.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Reverse Proxy ke Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Upload size limit (untuk file upload)
    client_max_body_size 100M;

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
}
```

Enable konfigurasi:

```bash
# Aktifkan site
sudo ln -s /etc/nginx/sites-available/lumicloud /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### 8. Setup SSL dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d lumicloud.your-domain.com -d www.lumicloud.your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

#### 9. Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

---

### Opsi 2: Deployment dengan aaPanel (Alternatif)

Karena Anda sudah punya aaPanel, bisa menggunakan fitur Node.js Manager di aaPanel:

#### 1. Login ke aaPanel

Akses: `https://vpsdashboard.lumicloude.my.id:9000`

#### 2. Install Node.js Manager

- Pergi ke **App Store**
- Cari **Node.js Version Manager**
- Install

#### 3. Setup Database via aaPanel

- Buka **Database** → **PostgreSQL**
- Create database `lumicloud`
- Create user dengan password

#### 4. Upload Source Code

- Upload file via **Files** manager
- Extract ke `/www/wwwroot/lumicloud.your-domain.com`

#### 5. Setup di Node.js Manager

- Buka **Node.js Manager**
- Klik **Add Project**
- Pilih direktori project
- Set startup file: `node_modules/next/dist/bin/next start`
- Set port: `3000`
- Add environment variables

#### 6. Setup Reverse Proxy

- Buka **Website**
- Add site dengan domain Anda
- Set reverse proxy ke `http://127.0.0.1:3000`
- Enable SSL via Let's Encrypt

---

## Post-Deployment

### 1. Verifikasi Aplikasi

```bash
# Check aplikasi running
pm2 status

# Check logs
pm2 logs lumicloud

# Check Nginx
sudo systemctl status nginx

# Test endpoint
curl https://lumicloud.your-domain.com
```

### 2. Setup Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Setup log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. Backup Strategy

```bash
# Backup database
pg_dump -U lumicloud_user -d lumicloud > backup_$(date +%Y%m%d).sql

# Backup uploaded files
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /var/www/lumicloud/public/uploads/

# Setup cronjob untuk backup otomatis
crontab -e

# Tambahkan (backup setiap hari jam 2 pagi)
0 2 * * * pg_dump -U lumicloud_user -d lumicloud > /backups/lumicloud_$(date +\%Y\%m\%d).sql
```

---

## Update Aplikasi

### Update via Git

```bash
cd /var/www/lumicloud

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart PM2
pm2 restart lumicloud

# Check status
pm2 status
pm2 logs lumicloud --lines 50
```

### Rollback

```bash
cd /var/www/lumicloud

# Revert to previous commit
git revert HEAD

# Atau checkout commit tertentu
git checkout <commit-hash>

# Rebuild dan restart
npm install
npm run build
pm2 restart lumicloud
```

---

## Troubleshooting

### Aplikasi tidak bisa diakses

```bash
# Check PM2 status
pm2 status
pm2 logs lumicloud --lines 100

# Check port 3000
netstat -tlnp | grep 3000

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
```

### Database connection error

```bash
# Check PostgreSQL running
sudo systemctl status postgresql

# Test connection
psql -U lumicloud_user -d lumicloud -h localhost

# Check .env DATABASE_URL
cat .env | grep DATABASE_URL
```

### SSL Certificate error

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

### High Memory Usage

```bash
# Check memory
free -h

# Restart PM2 app
pm2 restart lumicloud

# Set memory limit di ecosystem.config.js
max_memory_restart: '1G'
```

---

## Security Checklist

- ✅ Gunakan HTTPS dengan SSL certificate
- ✅ Set strong passwords untuk database
- ✅ Generate secure NEXTAUTH_SECRET
- ✅ Ubah credentials iPaymu ke production
- ✅ Enable firewall (UFW)
- ✅ Update sistem secara berkala
- ✅ Backup database dan files
- ✅ Monitor logs untuk suspicious activity
- ✅ Set proper file permissions (chmod 600 .env)
- ✅ Disable direktori listing di Nginx

---

## Performance Optimization

### 1. Enable Next.js Caching

Sudah otomatis di production build

### 2. Enable Nginx Caching

```nginx
# Tambahkan di /etc/nginx/nginx.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=nextjs_cache:10m max_size=1g inactive=60m use_temp_path=off;
```

### 3. Database Optimization

```sql
-- Create indexes untuk performa
CREATE INDEX idx_orders_user_id ON "Order"("userId");
CREATE INDEX idx_orders_status ON "Order"("status");
CREATE INDEX idx_subscriptions_user_id ON "Subscription"("userId");
```

### 4. Setup CDN (Optional)

Gunakan Cloudflare untuk caching static assets dan CDN

---

## Contacts & Support

Jika ada masalah deployment, check:

- Next.js logs: `pm2 logs lumicloud`
- Nginx logs: `/var/log/nginx/error.log`
- PostgreSQL logs: `/var/log/postgresql/postgresql-14-main.log`

---

**Happy Deploying! 🚀**
