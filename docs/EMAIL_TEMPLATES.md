# 📧 Email Templates - LumiCloud

Template email yang profesional dan modern dengan branding konsisten LumiCloud.

## 🎨 Design Features

### Color Scheme (sesuai website)

- **Primary Blue**: `#0090e6` - Warna utama LumiCloud
- **Purple**: `#7b00e2` - Aksen gradient
- **Gold**: `#ffc51a` - Highlight dan aksen
- **Background**: Dark gradient (`#0a0a1a` → `#0d0d2b`)
- **Glass Effect**: Semi-transparent dengan backdrop blur

### Visual Elements

- ✅ Logo LumiCloud di header (80x80px untuk OTP, 100x100px untuk Welcome)
- ✅ Gradient header dengan wave pattern overlay
- ✅ Glass morphism effect pada container
- ✅ Animated gradient text untuk nama user
- ✅ Professional icons dan emojis
- ✅ Responsive design untuk mobile
- ✅ Modern card-based layout

## 📨 1. OTP Email Template

### Preview

```
┌─────────────────────────────────────┐
│   [GRADIENT HEADER - Blue→Purple]   │
│         [LOGO LUMICLOUD]            │
│     🔐 Verifikasi Email Anda        │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Halo [Username],                   │
│                                     │
│  Terima kasih bergabung...          │
│                                     │
│  ┌─────────────────────────┐       │
│  │  KODE VERIFIKASI ANDA   │       │
│  │      [1 2 3 4 5 6]      │       │
│  │  Berlaku 10 menit       │       │
│  └─────────────────────────┘       │
│                                     │
│  ⚠️ PERINGATAN KEAMANAN             │
│  Jangan bagikan kode OTP...         │
│                                     │
└─────────────────────────────────────┘
```

### Key Features

- **Large OTP Display**: 42px font size dengan gradient color
- **Security Warning**: Yellow-bordered box dengan peringatan jelas
- **Expiry Timer**: Informasi berlaku 10 menit
- **Glass Container**: Background dengan blur effect
- **Gradient Border**: Border dengan warna brand

### HTML Structure

```html
<div class="header">
  <div class="logo">
    <img src="https://lumicloud.my.id/images/logo.png" />
  </div>
  <h1>🔐 Verifikasi Email Anda</h1>
</div>

<div class="content">
  <div class="otp-container">
    <div class="otp-code">123456</div>
  </div>
  <div class="warning-box">⚠️ Peringatan Keamanan</div>
</div>
```

## 🎉 2. Welcome Email Template

### Preview

```
┌─────────────────────────────────────┐
│ [GRADIENT - Blue→Purple→Gold]       │
│         [LOGO LUMICLOUD]            │
│              🎉                      │
│   Selamat Datang di LumiCloud!      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Halo [Username]!                   │
│                                     │
│  ✓ Email Berhasil Diverifikasi     │
│                                     │
│  Apa yang Anda Dapatkan?            │
│                                     │
│  ⚡ Performa Super Cepat             │
│     Server NVMe SSD...              │
│                                     │
│  🔒 Keamanan Terjamin                │
│     SSL Certificate gratis...       │
│                                     │
│  💾 Backup Otomatis                  │
│     Backup harian...                │
│                                     │
│  🎯 Uptime 99.9%                     │
│     Garansi uptime...               │
│                                     │
│  💬 Support 24/7                     │
│     Tim profesional...              │
│                                     │
│    [🚀 Mulai Sekarang]              │
│                                     │
│  Butuh Bantuan?                     │
│  [📧 Email] [💬 WhatsApp]           │
│                                     │
└─────────────────────────────────────┘
```

### Key Features

- **Success Badge**: Verified checkmark dengan border gradient
- **Feature Grid**: 5 fitur utama dengan icons dan descriptions
- **CTA Button**: Gradient button dengan shadow effect
- **Support Box**: Gold-accent box dengan contact links
- **Card Layout**: Modern card-based feature presentation

### HTML Structure

```html
<div class="header">
  <div class="logo">
    <img src="https://lumicloud.my.id/images/logo.png" />
  </div>
  <span class="emoji">🎉</span>
  <h1>Selamat Datang di LumiCloud!</h1>
</div>

<div class="content">
  <div class="success-badge">✓ Email Berhasil Diverifikasi</div>

  <div class="features-grid">
    <div class="feature-item">
      <div class="feature-icon">⚡</div>
      <div class="feature-text">...</div>
    </div>
    <!-- More features -->
  </div>

  <a href="..." class="cta-button"> 🚀 Mulai Sekarang </a>

  <div class="support-box">
    <!-- Support links -->
  </div>
</div>
```

## 🎨 CSS Highlights

### Glass Morphism Effect

```css
.container {
  background: linear-gradient(
    180deg,
    rgba(13, 13, 43, 0.95) 0%,
    rgba(10, 10, 26, 0.95) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 144, 230, 0.15);
}
```

### Gradient Text

```css
.greeting strong {
  background: linear-gradient(135deg, #0090e6, #7b00e2, #ffc51a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Feature Cards

```css
.feature-item {
  background: linear-gradient(
    135deg,
    rgba(0, 144, 230, 0.05),
    rgba(123, 0, 226, 0.05)
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
```

## 📱 Responsive Design

### Mobile Breakpoint

```css
@media only screen and (max-width: 600px) {
  body {
    padding: 20px 10px;
  }
  .content {
    padding: 30px 20px;
  }
  .otp-code {
    font-size: 36px;
    letter-spacing: 8px;
  }
  .features-grid {
    gap: 12px;
  }
}
```

## 🔗 Links & CTAs

### Email Footer Links

- **Website**: https://lumicloud.my.id
- **Support Email**: support@lumicloud.my.id
- **WhatsApp**: https://wa.me/6282332238228

### Call-to-Action Buttons

- Primary CTA: "🚀 Mulai Sekarang" → Links to dashboard
- Support Links: Email & WhatsApp dengan hover effects

## 📊 Email Metrics

### File Sizes (Approximate)

- OTP Email HTML: ~8KB
- Welcome Email HTML: ~12KB
- Logo Image: ~5KB (cached from website)

### Compatibility

- ✅ Gmail (Web, Mobile)
- ✅ Outlook (2016+)
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Mobile Clients (iOS, Android)

## 🎯 Best Practices Implemented

1. **Inline CSS**: All styles inline untuk email client compatibility
2. **Table-free Layout**: Modern div-based layout
3. **Alt Text**: Logo memiliki alt text
4. **Fallback Fonts**: System fonts sebagai fallback
5. **Color Contrast**: High contrast untuk accessibility
6. **Mobile-first**: Responsive dengan media queries
7. **Safe Colors**: Web-safe colors dengan fallbacks
8. **Clear CTAs**: Prominent call-to-action buttons

## 🔧 Customization

### Changing Colors

Edit di file `lib/email.ts`:

```typescript
// Primary colors
--lumi-blue: #0090e6
--lumi-purple: #7b00e2
--lumi-gold: #ffc51a

// Gradients
background: linear-gradient(135deg, #0090e6, #7b00e2)
```

### Adding New Sections

Tambahkan di dalam `.content` div:

```html
<div class="new-section">
  <!-- Content -->
</div>
```

### Logo Customization

```html
<div class="logo">
  <img
    src="https://lumicloud.my.id/images/logo.png"
    alt="LumiCloud Logo"
    width="60"
    height="60"
  />
</div>
```

## 📝 Testing Checklist

- [ ] Test OTP email delivery
- [ ] Test Welcome email delivery
- [ ] Verify logo displays correctly
- [ ] Check gradient rendering
- [ ] Test on mobile devices
- [ ] Verify links work correctly
- [ ] Test in multiple email clients
- [ ] Check dark mode compatibility
- [ ] Verify SMTP settings
- [ ] Test OTP expiry time

## 🚀 Production Tips

1. **Email Sending**:
   - Use verified SMTP credentials
   - Implement rate limiting
   - Add email queue for reliability

2. **Monitoring**:
   - Track email delivery rates
   - Monitor bounce rates
   - Log failed deliveries

3. **Testing**:
   - Use email testing tools (Litmus, Email on Acid)
   - Test across different email clients
   - Validate HTML rendering

4. **Security**:
   - Never expose SMTP credentials
   - Use environment variables
   - Implement SPF, DKIM, DMARC

## 📧 Example Usage

```typescript
import { getEmailService } from "@/lib/email";

// Send OTP
const emailService = getEmailService();
await emailService.sendOTP({
  to: "user@example.com",
  name: "John Doe",
  otp: "123456",
});

// Send Welcome
await emailService.sendWelcome("user@example.com", "John Doe");
```

---

**Design by**: LumiCloud Team  
**Last Updated**: January 21, 2026  
**Version**: 2.0 - Professional Edition
