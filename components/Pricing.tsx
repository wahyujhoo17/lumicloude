"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Server, Rocket, Crown } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    description: "Cocok untuk website personal dan blog",
    price: "15.000",
    period: "/bulan",
    icon: Server,
    features: [
      "500 MB NVMe SSD Storage",
      "5 GB Bandwidth",
      "1 Website",
      "Free SSL Certificate",
      "Daily Backup",
      "cPanel Access",
      "Email Support",
    ],
    popular: false,
    gradient: "from-lumi-blue-500 to-lumi-blue-600",
    iconBg: "bg-lumi-blue-500/20",
    iconColor: "text-lumi-blue-400",
    checkColor: "text-lumi-blue-400",
    borderColor: "hover:border-lumi-blue-500/50",
  },
  {
    name: "Business",
    description: "Ideal untuk bisnis dan toko online",
    price: "30.000",
    period: "/bulan",
    icon: Rocket,
    features: [
      "3 GB NVMe SSD",
      "Unlimited Bandwidth",
      "5 Website",
      "Free SSL Certificate",
      "Daily Backup",
      "cPanel Access",
      "Free Domain 1 Tahun",
      "Priority Support 24/7",
      "Imunify360 Security",
    ],
    popular: true,
    gradient: "from-lumi-purple-500 to-lumi-blue-500",
    iconBg: "bg-lumi-purple-500/20",
    iconColor: "text-lumi-purple-400",
    checkColor: "text-lumi-purple-400",
    borderColor: "border-lumi-purple-500/50",
  },
  {
    name: "Enterprise",
    description: "Untuk website dengan traffic tinggi",
    price: "70.000",
    period: "/bulan",
    icon: Crown,
    features: [
      "10 GB NVMe SSD",
      "Unlimited Bandwidth",
      "Unlimited Website",
      "Free SSL Wildcard",
      "Daily Backup + Weekly",
      "cPanel Access",
      "Free Domain 1 Tahun",
      "Dedicated Support 24/7",
      "Imunify360 + Firewall",
      "CDN Integration",
      "Staging Environment",
    ],
    popular: false,
    gradient: "from-lumi-gold-400 to-lumi-gold-600",
    iconBg: "bg-lumi-gold-500/20",
    iconColor: "text-lumi-gold-400",
    checkColor: "text-lumi-gold-400",
    borderColor: "hover:border-lumi-gold-500/50",
  },
];

const vpsPlans = [
  {
    name: "VPS Basic",
    specs: "1 vCPU • 1 GB RAM • 10 GB SSD",
    price: "50.000",
    soldOut: true,
  },
  {
    name: "VPS Standard",
    specs: "2 vCPU • 2 GB RAM • 20 GB SSD",
    price: "100.000",
    soldOut: true,
  },
  {
    name: "VPS Pro",
    specs: "4 vCPU • 4 GB RAM • 40 GB SSD",
    price: "200.000",
    soldOut: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-lumi-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-lumi-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-lumi-gold-500/30 to-transparent" />
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
          <span className="inline-block px-4 py-2 text-sm font-medium text-lumi-blue-400 bg-lumi-blue-400/10 rounded-full mb-4">
            Harga Terjangkau
          </span>
          <h2 className="section-title">
            Pilih <span className="gradient-text">Paket Hosting</span> Anda
          </h2>
          <p className="section-subtitle">
            Paket hosting yang sesuai dengan kebutuhan dan budget Anda. Semua
            paket termasuk SSL gratis dan support 24/7.
          </p>
        </motion.div>

        {/* Cloud Hosting Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-20 items-stretch">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col h-full rounded-2xl border-2 border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] backdrop-blur-xl transition-all duration-500 hover:shadow-2xl ${
                  plan.popular
                    ? "border-lumi-purple-500/50 lg:scale-105 shadow-lg shadow-lumi-purple-500/20"
                    : plan.borderColor
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-5 py-1.5 bg-gradient-to-r from-lumi-purple-500 to-lumi-blue-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-lumi-purple-500/30">
                      <Star className="w-4 h-4" fill="currentColor" />
                      Paling Populer
                    </span>
                  </div>
                )}

                {/* Card Header */}
                <div className="p-8 pb-0">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${plan.iconBg} mb-5`}
                  >
                    <IconComponent className={`w-7 h-7 ${plan.iconColor}`} />
                  </div>

                  {/* Plan Name & Description */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price Section */}
                <div className="p-8 pt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-400 font-medium">
                      Rp
                    </span>
                    <span className="text-5xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 font-medium">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-8">
                  <div
                    className={`h-px bg-gradient-to-r ${plan.gradient} opacity-30`}
                  />
                </div>

                {/* Features List */}
                <div className="p-8 flex-grow">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
                    Yang Anda Dapatkan
                  </p>
                  <ul className="space-y-3.5">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full ${plan.iconBg} flex items-center justify-center mt-0.5`}
                        >
                          <Check className={`w-3 h-3 ${plan.checkColor}`} />
                        </div>
                        <span className="text-gray-300 text-sm leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="p-8 pt-0 mt-auto">
                  <a
                    href={`https://wa.me/082332238228?text=${encodeURIComponent(
                      `Halo LumiCloud!\n\nSaya tertarik untuk berlangganan:\n\nPaket: ${plan.name}\nHarga: Rp ${plan.price}${plan.period}\n\nMohon informasi lebih lanjut untuk proses pemesanan.\n\nTerima kasih!`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-4 rounded-xl font-semibold transition-all duration-300 text-center ${
                      plan.popular
                        ? "bg-gradient-to-r from-lumi-purple-500 to-lumi-blue-500 text-white shadow-lg shadow-lumi-purple-500/30 hover:shadow-lumi-purple-500/50 hover:scale-[1.02]"
                        : "bg-white/10 text-white hover:bg-white/20 hover:scale-[1.02]"
                    }`}
                  >
                    Pilih Paket {plan.name}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* VPS Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Butuh Lebih Powerful?{" "}
            <span className="gradient-text-gold">VPS Hosting</span>
          </h3>
          <p className="text-gray-400">
            Dapatkan kontrol penuh dengan VPS hosting kami
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vpsPlans.map((vps, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative rounded-xl border bg-gradient-to-b p-6 transition-all duration-300 ${
                vps.soldOut
                  ? "border-red-500/30 from-red-500/5 to-transparent opacity-70"
                  : "border-white/10 from-white/[0.08] to-transparent hover:border-lumi-gold-500/50 hover:shadow-lg hover:shadow-lumi-gold-500/10"
              }`}
            >
              {/* Sold Out Badge */}
              {vps.soldOut && (
                <>
                  {/* Diagonal ribbon */}
                  <div className="absolute -top-1 -right-1 z-20 overflow-hidden w-24 h-24 pointer-events-none">
                    <div className="absolute top-5 right-[-32px] w-32 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold text-center py-1 rotate-45 shadow-lg">
                      SOLD OUT
                    </div>
                  </div>

                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.02] to-red-600/[0.05] rounded-xl pointer-events-none"></div>
                </>
              )}

              <div
                className={`flex items-center justify-between ${vps.soldOut ? "mt-8" : ""}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        vps.soldOut ? "bg-gray-500/20" : "bg-lumi-gold-500/20"
                      }`}
                    >
                      <Zap
                        className={`w-5 h-5 ${
                          vps.soldOut ? "text-gray-500" : "text-lumi-gold-400"
                        }`}
                      />
                    </div>
                    <h4
                      className={`text-lg font-bold transition-colors ${
                        vps.soldOut
                          ? "text-gray-400"
                          : "text-white group-hover:text-lumi-gold-400"
                      }`}
                    >
                      {vps.name}
                    </h4>
                  </div>
                  <p
                    className={`text-sm pl-[52px] ${
                      vps.soldOut ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {vps.specs}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-500 mb-1">Mulai dari</p>
                  <p
                    className={`text-2xl font-bold ${
                      vps.soldOut
                        ? "text-gray-500 line-through"
                        : "text-lumi-gold-400"
                    }`}
                  >
                    Rp {vps.price}
                  </p>
                  <p className="text-gray-500 text-xs">/bulan</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  disabled={vps.soldOut}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    vps.soldOut
                      ? "bg-gradient-to-r from-gray-500/10 to-gray-600/10 text-gray-500 cursor-not-allowed border border-gray-500/20"
                      : "bg-lumi-gold-500/10 text-lumi-gold-400 hover:bg-lumi-gold-500/20 hover:scale-[1.02]"
                  }`}
                >
                  {vps.soldOut ? "Tidak Tersedia" : "Pilih VPS"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-lumi-purple-500/10 via-lumi-blue-500/10 to-lumi-gold-500/10 p-8 md:p-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-lumi-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lumi-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Butuh Paket <span className="gradient-text-gold">Custom</span>
                  ?
                </h3>
                <p className="text-gray-400 max-w-md">
                  Tim kami siap membantu menyusun paket hosting sesuai kebutuhan
                  spesifik bisnis Anda dengan harga terbaik.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="#contact"
                  className="px-8 py-4 bg-gradient-to-r from-lumi-gold-400 to-lumi-gold-500 text-gray-900 font-semibold rounded-xl shadow-lg shadow-lumi-gold-500/30 hover:shadow-lumi-gold-500/50 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Hubungi Sales
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
