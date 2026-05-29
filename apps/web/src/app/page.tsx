import { HeroBanner } from '@/components/home/hero-banner';
import { ContentRow } from '@/components/home/content-row';
import { MicroDramaSection } from '@/components/home/micro-drama-section';

export default function HomePage() {
  return (
    <div className="space-y-8 pb-20">
      <HeroBanner />
      <div className="space-y-10 px-4 md:px-8 lg:px-12">
        <ContentRow title="Continue Watching" endpoint="/users/continue-watching" />
        <ContentRow title="Trending Now" endpoint="/content/trending" />
        <ContentRow title="New Releases" endpoint="/content/new-releases" />
        <MicroDramaSection />
        <ContentRow title="Popular Series" endpoint="/content?type=TV_SERIES&limit=12" />
        <ContentRow title="Micro Dramas" endpoint="/content?type=MICRO_DRAMA&limit=12" />
      </div>
    </div>
  );
}
