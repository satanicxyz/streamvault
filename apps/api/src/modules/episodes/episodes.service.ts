import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EpisodesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByContent(contentId: string, season?: number) {
    return this.prisma.episode.findMany({
      where: {
        contentId,
        ...(season && { seasonNumber: season }),
      },
      orderBy: [{ seasonNumber: 'asc' }, { episodeNumber: 'asc' }],
      include: { subtitles: true },
    });
  }

  async findById(id: string) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: { subtitles: true, content: true },
    });

    if (!episode) throw new NotFoundException('Episode not found');
    return episode;
  }

  async getStreamingInfo(episodeId: string, userId?: string) {
    const episode = await this.findById(episodeId);

    if (episode.isLocked && !episode.isFree) {
      if (!userId) {
        return { locked: true, episode: { id: episode.id, title: episode.title } };
      }

      const subscription = await this.prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription || subscription.status !== 'ACTIVE') {
        return { locked: true, episode: { id: episode.id, title: episode.title } };
      }
    }

    return {
      locked: false,
      episode: {
        id: episode.id,
        title: episode.title,
        hlsUrl: episode.hlsUrl,
        videoUrl: episode.videoUrl,
        duration: episode.duration,
        subtitles: episode.subtitles,
      },
    };
  }
}
