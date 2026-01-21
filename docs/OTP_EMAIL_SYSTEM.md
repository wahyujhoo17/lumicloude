# OTP Email Verification System

Sistem verifikasi email dengan OTP (One-Time Password) untuk registrasi user baru.

## 📧 Email Configuration

### SMTP Settings

- **Host**: notify.lumicloud.my.id
- **Port**: 587 (TLS) / 465 (SSL) / 25
- **Username**: notify@lumicloud.my.id
- **Password**: Elsafira2512
- **Secure**: false (untuk port 587)

### Email Services

- **POP3**: notify.lumicloud.my.id:110 (995 untuk SSL)
- **IMAP**: notify.lumicloud.my.id:143 (993 untuk SSL)
- **SMTP**: notify.lumicloud.my.id:25/465/587

## 🔐 Features

1. **OTP Generation**: 6-digit random code
2. **OTP Expiry**: 10 minutes validity
3. **Email Templates**: Beautiful HTML emails
4. **Welcome Email**: Sent after successful verification
5. **Resend OTP**: Users can request new OTP

## 📋 API Endpoints

### 1. Register User (dengan OTP)

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "08123456789" // optional
}
```

**Response Success:**

```json
{
  "message": "Registrasi berhasil! Silakan cek email Anda untuk kode verifikasi OTP.",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false
  },
  "otpSent": true
}
```

### 2. Verify OTP

```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response Success:**

```json
{
  "message": "Email berhasil diverifikasi!",
  "success": true
}
```

**Error Responses:**

- Invalid OTP: `{ "error": "Kode OTP tidak valid" }`
- Expired OTP: `{ "error": "Kode OTP sudah kadaluarsa. Silakan minta kode baru." }`
- Already verified: `{ "error": "Email sudah terverifikasi sebelumnya" }`

### 3. Resend OTP

```bash
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response Success:**

```json
{
  "message": "Kode OTP baru telah dikirim ke email Anda",
  "success": true
}
```

## 🗄️ Database Schema

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  password      String
  name          String
  phone         String?
  emailVerified Boolean        @default(false)  // ✨ New
  otp           String?                         // ✨ New
  otpExpiry     DateTime?                       // ✨ New
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}
```

## 📧 Email Templates

### OTP Email

- **Subject**: "Verifikasi Email - LumiCloud"
- **Content**:
  - Welcome message
  - 6-digit OTP code in highlighted box
  - Expiry warning (10 minutes)
  - Security warning
  - LumiCloud branding

### Welcome Email

- **Subject**: "Selamat Datang di LumiCloud! 🎉"
- **Content**:
  - Congratulations message
  - Feature highlights
  - Call-to-action button
  - Support information

## 🔧 Environment Variables

Add to your `.env` file:

```env
# SMTP Email Configuration
SMTP_HOST=notify.lumicloud.my.id
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=notify@lumicloud.my.id
SMTP_PASS=Elsafira2512
```

## 🚀 Testing

### Test Registration with OTP:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "08123456789"
  }'
```

### Test OTP Verification:

```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

### Test Resend OTP:

```bash
curl -X POST http://localhost:3001/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## 🎨 Email Design

Emails menggunakan design yang modern dengan:

- Gradient header (purple theme)
- Clean layout dengan max-width 600px
- Responsive design
- Large, readable OTP code
- Warning box dengan styling khusus
- Professional footer

## 🔒 Security Features

1. **OTP Expiry**: Kode hanya valid 10 menit
2. **One-time Use**: OTP dihapus setelah digunakan
3. **Email Validation**: Format email divalidasi
4. **Password Hashing**: Password di-hash dengan bcrypt
5. **Secure SMTP**: Menggunakan TLS/SSL

## 📝 User Flow

1. User mengisi form registrasi
2. Sistem generate OTP 6 digit
3. OTP disimpan di database dengan expiry time
4. Email OTP dikirim ke user
5. User memasukkan OTP
6. Sistem verifikasi OTP dan expiry
7. Jika valid, emailVerified = true
8. Welcome email dikirim
9. User dapat login

## ⚠️ Error Handling

- Email gagal terkirim: User tetap terdaftar, tapi diberi warning
- OTP expired: User bisa request OTP baru
- Invalid OTP: Error message yang jelas
- Network error: Graceful error handling

## 🔄 Next Steps

Untuk production, pertimbangkan:

1. Rate limiting untuk resend OTP
2. Email queue dengan retry mechanism
3. Monitoring email delivery status
4. Template email yang customizable
5. Multi-language support
