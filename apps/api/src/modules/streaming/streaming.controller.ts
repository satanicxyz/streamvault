import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { StreamingService } from './streaming.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Streaming')
@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Get('manifest/:episodeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get HLS manifest for an episode' })
  async getManifest(@Param('episodeId') episodeId: string, @Res() res: Response) {
    const manifest = this.streamingService.generateHlsManifest(episodeId);
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(manifest);
  }

  @Get('url/:episodeId/:quality')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get signed streaming URL' })
  async getStreamUrl(
    @Param('episodeId') episodeId: string,
    @Param('quality') quality: string,
  ) {
    const url = this.streamingService.generateSignedUrl(
      `streams/${episodeId}/${quality}/index.m3u8`,
    );
    return { url };
  }
}
