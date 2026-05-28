import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentType, ContentStatus, Prisma } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    type?: ContentType;
    genreId?: string;
    search?: string;
    status?: ContentStatus;
  }) {
    const { page = 1, limit = 20, type, genreId, search, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ContentWhereInput = {
      ...(type && { type }),
      ...(status ? { status } : { status: ContentStatus.PUBLISHED }),
      ...(genreId && { genres: { some: { genreId } } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          genres: { include: { genre: true } },
          _count: { select: { episodes: true, likes: true } },
        },
      }),
      this.prisma.content.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const content = await this.prisma.content.findUnique({
      where: { slug },
      include: {
        genres: { include: { genre: true } },
        actors: { include: { actor: true } },
        episodes: { orderBy: [{ seasonNumber: 'asc' }, { episodeNumber: 'asc' }] },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async findById(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        genres: { include: { genre: true } },
        episodes: { orderBy: [{ seasonNumber: 'asc' }, { episodeNumber: 'asc' }] },
      },
    });

    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  async getTrending(limit = 10) {
    return this.prisma.content.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { viewCount: 'desc' },
      take: limit,
      include: { genres: { include: { genre: true } } },
    });
  }

  async getNewReleases(limit = 10) {
    return this.prisma.content.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { genres: { include: { genre: true } } },
    });
  }

  async getMicroDramas(page = 1, limit = 20) {
    return this.findAll({
      page,
      limit,
      type: ContentType.MICRO_DRAMA,
    });
  }

  async incrementViewCount(id: string) {
    await this.prisma.content.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }
}
