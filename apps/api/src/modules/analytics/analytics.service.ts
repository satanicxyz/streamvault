import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalContent, totalViews, activeSubscriptions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.content.count(),
      this.prisma.content.aggregate({ _sum: { viewCount: true } }),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    ]);

    return {
      totalUsers,
      totalContent,
      totalViews: totalViews._sum.viewCount || 0,
      activeSubscriptions,
    };
  }

  async getTopContent(limit = 10) {
    return this.prisma.content.findMany({
      orderBy: { viewCount: 'desc' },
      take: limit,
      select: { id: true, title: true, type: true, viewCount: true, rating: true },
    });
  }

  async getRecentActivity(limit = 20) {
    return this.prisma.watchHistory.findMany({
      orderBy: { watchedAt: 'desc' },
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
        content: { select: { id: true, title: true } },
      },
    });
  }
}
