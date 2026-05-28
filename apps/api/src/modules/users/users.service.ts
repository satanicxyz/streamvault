import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getWatchHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.prisma.watchHistory.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
      skip,
      take: limit,
      include: { content: true, episode: true },
    });
  }

  async getContinueWatching(userId: string, limit = 10) {
    return this.prisma.watchHistory.findMany({
      where: { userId, completed: false },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: { content: true, episode: true },
    });
  }

  async updateWatchProgress(userId: string, contentId: string, episodeId: string | null, progress: number, duration: number) {
    const completed = duration > 0 && progress / duration > 0.9;

    await this.prisma.watchHistory.upsert({
      where: {
        userId_contentId_episodeId: { userId, contentId, episodeId: episodeId || '' },
      },
      create: { userId, contentId, episodeId, progress, duration, completed },
      update: { progress, duration, completed, watchedAt: new Date() },
    });
  }
}
