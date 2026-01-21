"use client";

import { useState, useEffect } from "react";
import { Menu, X, Cloud, LogIn, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import AuthModal from "./AuthModal";

const navLinks = [
  { name: "Beranda", href: "#hero" },
  { name: "Layanan", href: "#features" },
  { name: "Paket", href: "#pricing" },
  { name: "Testimoni", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
  { name: "Kontak", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check for login query parameter
  useEffect(() => {
    if (searchParams.get("login") === "true" && !session) {
      setShowAuthModal(true);
    }
  }, [searchParams, session]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 relative flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="LumiCloud"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </Link>

          {/* Desktop Navigation & Auth - Flex container */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-between ml-12">
            {/* Navigation Links */}
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-gray-300 hover:text-white font-medium transition-colors relative group cursor-pointer"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-lumi-blue-400 to-lumi-purple-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* CTA Button & Auth - Right aligned */}
            <div className="flex items-center gap-4">
              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-lumi-purple-500 border-t-transparent rounded-full animate-spin" />
              ) : session ? (
                <div className="flex items-center gap-3">
                  <a
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("#pricing");
                    }}
                    className="btn-primary text-sm cursor-pointer"
                  >
                    Mulai Sekarang
                  </a>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    <User className="w-4 h-4 text-lumi-purple-400" />
                    <span className="text-sm text-white">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      signOut({ callbackUrl: window.location.origin })
                    }
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <a
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("#pricing");
                    }}
                    className="btn-primary text-sm cursor-pointer"
                  >
                    Mulai Sekarang
                  </a>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 glass rounded-xl p-4 animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                >
                  {link.name}
                </a>
              ))}

              {session ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    <User className="w-4 h-4 text-lumi-purple-400" />
                    <span className="text-sm text-white">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      signOut({ callbackUrl: window.location.origin })
                    }
                    className="flex items-center gap-2 justify-center px-4 py-2 text-sm text-white bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 justify-center px-4 py-2 text-sm text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                  <a
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#pricing");
                    }}
                    className="btn-primary text-center mt-2 cursor-pointer"
                  >
                    Mulai Sekarang
                  </a>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // Refresh session or do something after login
        }}
      />
    </header>
  );
}
