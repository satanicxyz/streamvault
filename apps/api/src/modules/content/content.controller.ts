import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { ContentType } from '@prisma/client';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'List all content with filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', enum: ContentType, required: false })
  @ApiQuery({ name: 'genreId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: ContentType,
    @Query('genreId') genreId?: string,
    @Query('search') search?: string,
  ) {
    return this.contentService.findAll({ page, limit, type, genreId, search });
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending content' })
  async getTrending(@Query('limit') limit?: number) {
    return this.contentService.getTrending(limit);
  }

  @Get('new-releases')
  @ApiOperation({ summary: 'Get new releases' })
  async getNewReleases(@Query('limit') limit?: number) {
    return this.contentService.getNewReleases(limit);
  }

  @Get('micro-dramas')
  @ApiOperation({ summary: 'Get micro dramas (vertical short content)' })
  async getMicroDramas(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.contentService.getMicroDramas(page, limit);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get content by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.contentService.findBySlug(slug);
  }
}
