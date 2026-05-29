import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EpisodesService } from './episodes.service';

@ApiTags('Episodes')
@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get('content/:contentId')
  @ApiOperation({ summary: 'Get episodes by content ID' })
  async findByContent(
    @Param('contentId') contentId: string,
    @Query('season') season?: number,
  ) {
    return this.episodesService.findByContent(contentId, season);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get episode by ID' })
  async findById(@Param('id') id: string) {
    return this.episodesService.findById(id);
  }

  @Get(':id/stream')
  @ApiOperation({ summary: 'Get streaming info for an episode' })
  async getStreamingInfo(@Param('id') id: string) {
    return this.episodesService.getStreamingInfo(id);
  }
}
