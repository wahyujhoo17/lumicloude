"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import Image from "next/image";
import LightPillar from "./LightPillar";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* LightPillar Background */}
        {/* <div className="absolute inset-0">
          <LightPillar
            topColor="#0070b3"
            bottomColor="#5a00a0"
            intensity={0.8}
            rotationSpeed={0.15}
            glowAmount={0.006}
            pillarWidth={4.5}
            pillarHeight={0.4}
            noiseIntensity={0.4}
            mixBlendMode="screen"
            pillarRotation={45}
          />
        </div> */}

        <div className="stars" />
        <div className="cloud-bg">
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
          <div className="cloud cloud-3" />
        </div>
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lumi-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lumi-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300">
              99.9% Uptime Guarantee
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">Cloud Hosting</span>
            <br />
            <span className="text-white">Cepat, Aman &</span>
            <br />
            <span className="gradient-text-gold">Terpercaya</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Solusi hosting premium dengan performa tinggi untuk website dan
            aplikasi Anda. Server SSD NVMe, support 24/7, dan harga terjangkau.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a
              href="#pricing"
              className="btn-primary flex items-center gap-2 group"
            >
              Lihat Paket
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#features" className="btn-outline">
              Pelajari Lebih Lanjut
            </a>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Zap,
                label: "Server Super Cepat",
                value: "NVMe SSD",
                color: "lumi-blue",
              },
              {
                icon: Shield,
                label: "Keamanan Terjamin",
                value: "SSL Gratis",
                color: "lumi-purple",
              },
              {
                icon: Globe,
                label: "Data Centers",
                value: "Global",
                color: "lumi-gold",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card p-4 hover:scale-105 transition-transform duration-300"
              >
                <stat.icon
                  className={`w-8 h-8 text-${stat.color}-400 mx-auto mb-2`}
                />
                <p className="text-lg font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
