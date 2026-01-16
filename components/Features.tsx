"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Clock,
  Server,
  Headphones,
  Globe,
  Database,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Performa Super Cepat",
    description:
      "Server dengan SSD NVMe dan LiteSpeed Web Server untuk kecepatan loading hingga 40x lebih cepat.",
    color: "lumi-blue",
  },
  {
    icon: Shield,
    title: "Keamanan Terjamin",
    description:
      "Dilengkapi dengan Imunify360, firewall canggih, dan proteksi DDoS untuk keamanan website Anda.",
    color: "lumi-purple",
  },
  {
    icon: Clock,
    title: "99.9% Uptime",
    description:
      "Garansi uptime 99.9% dengan monitoring 24/7 untuk memastikan website Anda selalu online.",
    color: "lumi-gold",
  },
  {
    icon: Server,
    title: "Data Center Premium",
    description:
      "Infrastruktur Tier-4 di Indonesia dan Singapura dengan konektivitas jaringan terbaik.",
    color: "lumi-blue",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description:
      "Tim support profesional siap membantu Anda kapan saja melalui live chat, ticket, dan telepon.",
    color: "lumi-purple",
  },
  {
    icon: Globe,
    title: "Domain & SSL Gratis",
    description:
      "Dapatkan domain gratis dan SSL certificate gratis untuk mengamankan website Anda.",
    color: "lumi-gold",
  },
  {
    icon: Database,
    title: "Auto Backup Harian",
    description:
      "Backup otomatis setiap hari dengan retensi hingga 30 hari untuk keamanan data Anda.",
    color: "lumi-blue",
  },
  {
    icon: Lock,
    title: "cPanel Intuitif",
    description:
      "Panel kontrol cPanel yang mudah digunakan untuk mengelola hosting Anda dengan efisien.",
    color: "lumi-purple",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-lumi-purple-500/50 to-transparent" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-lumi-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lumi-purple-500/10 rounded-full blur-3xl" />
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
          <span className="inline-block px-4 py-2 text-sm font-medium text-lumi-gold-400 bg-lumi-gold-400/10 rounded-full mb-4">
            Keunggulan Kami
          </span>
          <h2 className="section-title">
            Mengapa Memilih <span className="gradient-text">LumiCloud</span>?
          </h2>
          <p className="section-subtitle">
            Kami menyediakan solusi hosting terbaik dengan teknologi terkini dan
            dukungan pelanggan yang luar biasa.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group glass-card p-6 hover:scale-105 transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-${feature.color}-500/20 mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 glass-card p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Pelanggan Aktif" },
              { value: "99.9%", label: "Uptime Rate" },
              { value: "24/7", label: "Customer Support" },
              { value: "50+", label: "Server Locations" },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-3xl md:text-4xl font-bold gradient-text-gold mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
