import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.genre.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { contents: true } } },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.genre.findUnique({
      where: { slug },
      include: { contents: { include: { content: true }, take: 20 } },
    });
  }
}
