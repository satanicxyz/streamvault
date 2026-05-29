import { Controller, Get, Post, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user subscription' })
  async getMySubscription(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.subscriptionsService.getUserSubscription(user.id);
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe to a plan' })
  async subscribe(
    @Req() req: Request,
    @Body() body: { planId: string; period: 'monthly' | 'yearly' },
  ) {
    const user = req.user as { id: string };
    return this.subscriptionsService.subscribe(user.id, body.planId, body.period);
  }

  @Delete('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription' })
  async cancel(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.subscriptionsService.cancelSubscription(user.id);
  }
}
