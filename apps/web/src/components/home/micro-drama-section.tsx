'use client';

import { motion } from 'framer-motion';
import { Play, Lock } from 'lucide-react';
import Link from 'next/link';

const microDramas = Array.from({ length: 6 }, (_, i) => ({
  id: `micro-${i}`,
  title: `Episode ${i + 1}`,
  seriesTitle: 'Forbidden Love',
  thumbnailUrl: null,
  duration: '2:30',
  isLocked: i > 2,
  episodeNumber: i + 1,
}));

export function MicroDramaSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Vertical Dramas</h2>
          <p className="text-sm text-muted-foreground mt-1">Short-form addictive stories</p>
        </div>
        <Link href="/browse?type=MICRO_DRAMA" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {microDramas.map((drama) => (
          <motion.div
            key={drama.id}
            whileHover={{ scale: 1.03 }}
            className="relative aspect-[9/16] rounded-xl overflow-hidden bg-card group cursor-pointer"
          >
            <div className="w-full h-full bg-gradient-to-b from-purple-900/30 via-card to-card" />

            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <div className="flex items-center gap-2 mb-1">
                {drama.isLocked ? (
                  <Lock className="w-3 h-3 text-yellow-400" />
                ) : (
                  <Play className="w-3 h-3 text-primary fill-primary" />
                )}
                <span className="text-[10px] text-muted-foreground">{drama.duration}</span>
              </div>
              <h4 className="text-xs font-medium truncate">{drama.seriesTitle}</h4>
              <p className="text-[10px] text-muted-foreground">Ep. {drama.episodeNumber}</p>
            </div>

            {drama.isLocked && (
              <div className="absolute top-2 right-2 p-1 bg-yellow-500/20 rounded">
                <Lock className="w-3 h-3 text-yellow-400" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                className="p-2 bg-primary/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="w-4 h-4 fill-white text-white" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
