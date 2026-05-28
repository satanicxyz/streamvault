'use client';

import { motion } from 'framer-motion';
import { Play, Info, Plus } from 'lucide-react';
import Link from 'next/link';

const featured = {
  title: 'The Last Kingdom',
  description:
    'An epic saga of love, betrayal, and war in a world where kingdoms rise and fall. Follow the journey of an unlikely hero.',
  backdrop: '/images/hero-placeholder.jpg',
  slug: 'the-last-kingdom',
  type: 'TV_SERIES',
  year: 2024,
  rating: 8.9,
};

export function HeroBanner() {
  return (
    <section className="relative h-[80vh] md:h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent z-10" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-background to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute bottom-20 md:bottom-32 left-4 md:left-12 z-20 max-w-2xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded">
            {featured.type.replace('_', ' ')}
          </span>
          <span className="text-muted-foreground text-sm">{featured.year}</span>
          <span className="text-yellow-400 text-sm">★ {featured.rating}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{featured.title}</h1>
        <p className="text-muted-foreground text-sm md:text-base mb-6 line-clamp-3">
          {featured.description}
        </p>

        <div className="flex items-center gap-3">
          <Link
            href={`/watch/${featured.slug}`}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all hover:scale-105"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch Now
          </Link>
          <Link
            href={`/series/${featured.slug}`}
            className="flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 font-medium rounded-lg transition-all"
          >
            <Info className="w-5 h-5" />
            More Info
          </Link>
          <button className="p-3 glass hover:bg-white/10 rounded-full transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
