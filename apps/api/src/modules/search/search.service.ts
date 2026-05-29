import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentStatus } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query.toLowerCase() } },
          ],
        },
        skip,
        take: limit,
        orderBy: { viewCount: 'desc' },
        include: { genres: { include: { genre: true } } },
      }),
      this.prisma.content.count({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query.toLowerCase() } },
          ],
        },
      }),
    ]);

    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getSuggestions(query: string) {
    const results = await this.prisma.content.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        title: { contains: query, mode: 'insensitive' },
      },
      take: 8,
      select: { id: true, title: true, type: true, posterUrl: true },
    });

    return results;
  }

  async getTrendingSearches() {
    return this.prisma.content.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { viewCount: 'desc' },
      take: 10,
      select: { id: true, title: true, type: true },
    });
  }
}
