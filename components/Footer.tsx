"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";

const footerLinks = {
  layanan: [
    { name: "Cloud Hosting", href: "#pricing" },
    { name: "VPS Hosting", href: "#pricing" },
    { name: "Dedicated Server", href: "#" },
    { name: "Domain", href: "#" },
    { name: "SSL Certificate", href: "#" },
    { name: "Email Hosting", href: "#" },
  ],
  perusahaan: [
    { name: "Tentang Kami", href: "#" },
    { name: "Karir", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Partnership", href: "#" },
    { name: "Data Center", href: "#" },
  ],
  bantuan: [
    { name: "Knowledge Base", href: "#" },
    { name: "Dokumentasi API", href: "#" },
    { name: "Status Server", href: "#" },
    { name: "Hubungi Support", href: "#contact" },
    { name: "Report Abuse", href: "#" },
  ],
  legal: [
    { name: "Syarat & Ketentuan", href: "#" },
    { name: "Kebijakan Privasi", href: "#" },
    { name: "SLA", href: "#" },
    { name: "Refund Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative pt-24 pb-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-lumi-gold-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lumi-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-lumi-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-12 mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Memulai dengan <span className="gradient-text">LumiCloud</span>
            ?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Dapatkan hosting berkualitas dengan harga terjangkau. Gratis migrasi
            dan support 24/7 untuk membantu Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing" className="btn-primary">
              Lihat Paket Hosting
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 relative flex-shrink-0">
                <img
                  src="/images/logo.png"
                  alt="LumiCloud"
                  className="w-16 h-16 object-contain"
                  loading="lazy"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Solusi cloud hosting terpercaya untuk bisnis dan personal. Server
              cepat, aman, dan support 24/7.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:support@lumicloud.my.id"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4 text-lumi-blue-400" />
                support@lumicloud.my.id
              </a>
              <a
                href="tel:+6281234567890"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Phone className="w-4 h-4 text-lumi-purple-400" />
                +62 812 3456 7890
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-lumi-gold-400 mt-0.5" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-white mb-4">Layanan</h4>
            <ul className="space-y-3">
              {footerLinks.layanan.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Bantuan</h4>
            <ul className="space-y-3">
              {footerLinks.bantuan.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="text-gray-400 text-sm mb-4">Metode Pembayaran:</p>
          <div className="flex flex-wrap gap-3">
            {[
              "BCA",
              "Mandiri",
              "BNI",
              "BRI",
              "DANA",
              "OVO",
              "GoPay",
              "QRIS",
            ].map((method) => (
              <span
                key={method}
                className="px-3 py-1 bg-white/5 rounded text-xs text-gray-400"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 LumiCloud. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Kembali ke atas
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
