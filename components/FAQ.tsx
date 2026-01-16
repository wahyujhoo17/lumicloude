"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Apa itu Cloud Hosting dan apa bedanya dengan shared hosting?",
    answer:
      "Cloud Hosting menggunakan beberapa server yang terhubung untuk menjamin ketersediaan dan performa yang lebih baik. Berbeda dengan shared hosting yang menggunakan satu server, cloud hosting memberikan skalabilitas yang lebih tinggi, uptime yang lebih baik, dan resource yang dedicated untuk website Anda.",
  },
  {
    question: "Apakah ada garansi uang kembali?",
    answer:
      "Ya! Kami memberikan garansi uang kembali 30 hari tanpa syarat. Jika Anda tidak puas dengan layanan kami dalam 30 hari pertama, kami akan mengembalikan pembayaran Anda secara penuh.",
  },
  {
    question: "Bagaimana cara migrasi dari hosting lain ke LumiCloud?",
    answer:
      "Kami menyediakan layanan migrasi GRATIS untuk semua pelanggan baru. Tim technical support kami akan membantu memindahkan website, database, dan email Anda tanpa downtime. Cukup berikan akses ke hosting lama Anda dan kami yang akan mengurus semuanya.",
  },
  {
    question: "Apakah SSL Certificate sudah termasuk?",
    answer:
      "Ya, semua paket hosting kami sudah termasuk SSL Certificate gratis dari Let's Encrypt. SSL akan otomatis terpasang dan diperpanjang secara otomatis untuk mengamankan website Anda.",
  },
  {
    question: "Berapa lama proses aktivasi hosting?",
    answer:
      "Hosting akan aktif secara instan setelah pembayaran dikonfirmasi. Untuk pembayaran via transfer bank, aktivasi membutuhkan waktu 1-15 menit setelah konfirmasi pembayaran.",
  },
  {
    question: "Apakah bisa upgrade atau downgrade paket?",
    answer:
      "Tentu! Anda bisa upgrade atau downgrade paket hosting kapan saja melalui dashboard. Untuk upgrade, selisih biaya akan dihitung secara pro-rata. Untuk downgrade, berlaku di periode billing berikutnya.",
  },
  {
    question: "Bagaimana sistem backup di LumiCloud?",
    answer:
      "Kami melakukan backup otomatis setiap hari dengan retensi hingga 30 hari. Anda juga bisa melakukan backup manual kapan saja melalui cPanel. Restore backup bisa dilakukan sendiri atau dengan bantuan tim support kami.",
  },
  {
    question: "Apa yang terjadi jika website saya kena hack?",
    answer:
      "Kami memiliki sistem keamanan berlapis termasuk Imunify360 dan firewall canggih. Jika terjadi masalah keamanan, tim support kami akan membantu membersihkan malware dan memulihkan website Anda dari backup tanpa biaya tambahan.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-lumi-purple-500/30 to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lumi-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 text-sm font-medium text-lumi-gold-400 bg-lumi-gold-400/10 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="section-title">
            Pertanyaan yang{" "}
            <span className="gradient-text">Sering Diajukan</span>
          </h2>
          <p className="section-subtitle">
            Temukan jawaban untuk pertanyaan umum tentang layanan kami
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle className="w-5 h-5 text-lumi-purple-400 flex-shrink-0" />
                  <span className="font-medium text-white">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pl-16">
                      <p className="text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
