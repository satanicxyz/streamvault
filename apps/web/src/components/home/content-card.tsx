'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Link from 'next/link';

interface ContentCardProps {
  item: {
    id: string;
    title: string;
    posterUrl: string | null;
    type: string;
    rating: string;
    year: number;
  };
}

export function ContentCard({ item }: ContentCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 w-[160px] md:w-[200px] group"
    >
      <Link href={`/series/${item.id}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card mb-2">
          {item.posterUrl ? (
            <img
              src={item.posterUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-card flex items-center justify-center">
              <span className="text-3xl font-bold text-muted-foreground/30">
                {item.title.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="p-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play className="w-5 h-5 fill-white text-white" />
            </motion.div>
          </div>

          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-medium">
            ★ {item.rating}
          </div>
        </div>

        <h3 className="text-sm font-medium truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground">
          {item.year} • {item.type.replace('_', ' ')}
        </p>
      </Link>
    </motion.div>
  );
}
