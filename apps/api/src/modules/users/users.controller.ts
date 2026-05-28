import { Controller, Get, Put, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.usersService.findById(user.id);
  }

  @Get('watch-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get watch history' })
  async getWatchHistory(@Req() req: Request, @Query('page') page?: number) {
    const user = req.user as { id: string };
    return this.usersService.getWatchHistory(user.id, page);
  }

  @Get('continue-watching')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get continue watching list' })
  async getContinueWatching(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.usersService.getContinueWatching(user.id);
  }

  @Put('watch-progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update watch progress' })
  async updateProgress(
    @Req() req: Request,
    @Body() body: { contentId: string; episodeId?: string; progress: number; duration: number },
  ) {
    const user = req.user as { id: string };
    await this.usersService.updateWatchProgress(user.id, body.contentId, body.episodeId || null, body.progress, body.duration);
    return { success: true };
  }
}
