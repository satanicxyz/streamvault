'use client';

import Link from 'next/link';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse' },
  { href: '/browse?type=TV_SERIES', label: 'Series' },
  { href: '/browse?type=MICRO_DRAMA', label: 'Micro Drama' },
  { href: '/browse?type=MOVIE', label: 'Movies' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/95 to-background/0 backdrop-blur-sm">
      <nav className="flex items-center justify-between px-4 md:px-8 lg:px-12 h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-gradient">
            StreamVault
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/search" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <Link href="/profile" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mx-4 rounded-lg overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
