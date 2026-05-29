import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class StreamingService {
  constructor(private readonly configService: ConfigService) {}

  generateSignedUrl(videoPath: string, expiresInSeconds = 3600): string {
    const secret = this.configService.get<string>('STREAMING_SECRET', 'streaming-secret');
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${videoPath}${expires}`)
      .digest('hex');

    const cdnBase = this.configService.get<string>('CDN_BASE_URL', 'https://cdn.streamvault.app');
    return `${cdnBase}/${videoPath}?expires=${expires}&signature=${signature}`;
  }

  generateHlsManifest(episodeId: string, qualities: string[] = ['360p', '480p', '720p', '1080p']): string {
    let manifest = '#EXTM3U\n#EXT-X-VERSION:3\n';

    const bandwidths: Record<string, number> = {
      '360p': 800000,
      '480p': 1400000,
      '720p': 2800000,
      '1080p': 5000000,
      '4k': 14000000,
    };

    const resolutions: Record<string, string> = {
      '360p': '640x360',
      '480p': '854x480',
      '720p': '1280x720',
      '1080p': '1920x1080',
      '4k': '3840x2160',
    };

    for (const quality of qualities) {
      const bandwidth = bandwidths[quality] || 2800000;
      const resolution = resolutions[quality] || '1280x720';
      const streamUrl = this.generateSignedUrl(`streams/${episodeId}/${quality}/index.m3u8`);

      manifest += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n`;
      manifest += `${streamUrl}\n`;
    }

    return manifest;
  }

  validateStreamToken(token: string, videoPath: string): boolean {
    const secret = this.configService.get<string>('STREAMING_SECRET', 'streaming-secret');

    try {
      const parts = token.split('.');
      if (parts.length !== 2) return false;

      const [expires, signature] = parts;
      if (!expires || !signature) return false;

      if (parseInt(expires) < Math.floor(Date.now() / 1000)) return false;

      const expected = crypto
        .createHmac('sha256', secret)
        .update(`${videoPath}${expires}`)
        .digest('hex');

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch {
      return false;
    }
  }
}
