"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Lathafannya",
    role: "CEO, oursee.my.id",
    rating: 5,
    content:
      "LumiCloud memberikan performa luar biasa untuk aplikasi kami. Uptime 100% selama 6 bulan terakhir dan support yang sangat responsif!",
  },
  {
    name: "Sarah Wijaya",
    role: "Web Developer",
    rating: 5,
    content:
      "Migrasi dari hosting lama sangat smooth. Tim support membantu sepenuhnya dan website jadi lebih cepat 3x lipat!",
  },
  {
    name: "Budi Santoso",
    role: "Owner, TokoOnline.com",
    rating: 5,
    content:
      "Toko online saya tidak pernah down lagi sejak pindah ke LumiCloud. Sangat recommended untuk bisnis online!",
  },
  {
    name: "Dewi Lestari",
    role: "Blogger",
    rating: 5,
    content:
      "Harga terjangkau dengan fitur lengkap. SSL gratis dan backup otomatis membuat saya tenang. Terima kasih LumiCloud!",
  },
  {
    name: "Rizky Firmansyah",
    role: "Freelance Developer",
    rating: 5,
    content:
      "Sudah hosting 20+ client di LumiCloud. Tidak pernah ada masalah dan client semua puas dengan performa websitenya.",
  },
  {
    name: "Maya Angelina",
    role: "Marketing Manager",
    rating: 5,
    content:
      "Dashboard yang user-friendly dan support 24/7 yang selalu siap membantu. Best hosting provider yang pernah saya gunakan!",
  },
];

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-lumi-blue-500/30 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-lumi-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-lumi-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 text-sm font-medium text-lumi-purple-400 bg-lumi-purple-400/10 rounded-full mb-4">
            Testimoni
          </span>
          <h2 className="section-title">
            Apa Kata <span className="gradient-text">Pelanggan Kami</span>?
          </h2>
          <p className="section-subtitle">
            Ribuan pelanggan telah mempercayakan hosting mereka kepada LumiCloud
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-transform duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-lumi-gold-400/30 mb-4" />

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-lumi-gold-400"
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lumi-blue-500/20 to-lumi-purple-500/20 flex items-center justify-center text-lg font-semibold text-lumi-blue-300">
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">Dipercaya oleh 150+ pelanggan</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div className="text-2xl font-bold text-gray-500">TechCorp</div>
            <div className="text-2xl font-bold text-gray-500">StartupID</div>
            <div className="text-2xl font-bold text-gray-500">WebAgency</div>
            <div className="text-2xl font-bold text-gray-500">EcommercePro</div>
            <div className="text-2xl font-bold text-gray-500">DigitalHub</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
