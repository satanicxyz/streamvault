import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GenresService } from './genres.service';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  async findAll() {
    return this.genresService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get genre by slug with content' })
  async findBySlug(@Param('slug') slug: string) {
    return this.genresService.findBySlug(slug);
  }
}
