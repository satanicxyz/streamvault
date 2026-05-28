'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ContentCard } from './content-card';

interface ContentRowProps {
  title: string;
  endpoint: string;
}

const placeholderItems = Array.from({ length: 8 }, (_, i) => ({
  id: `placeholder-${i}`,
  title: `Title ${i + 1}`,
  posterUrl: null,
  type: 'MOVIE' as const,
  rating: (7 + Math.random() * 2).toFixed(1),
  year: 2024,
}));

export function ContentRow({ title }: ContentRowProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <Link
          href="/browse"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
        {placeholderItems.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
