import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' },
    });
  }

  async getUserSubscription(userId: string) {
    return this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
  }

  async subscribe(userId: string, planId: string, period: 'monthly' | 'yearly') {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) throw new NotFoundException('Plan not found');

    const durationDays = period === 'yearly' ? 365 : 30;
    const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    return this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        planId,
        endDate,
        status: 'ACTIVE',
      },
      update: {
        planId,
        endDate,
        status: 'ACTIVE',
      },
    });
  }

  async cancelSubscription(userId: string) {
    return this.prisma.subscription.update({
      where: { userId },
      data: { status: 'CANCELLED', autoRenew: false },
    });
  }
}
