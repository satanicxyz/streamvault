import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ContentModule } from './modules/content/content.module';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { GenresModule } from './modules/genres/genres.module';
import { StreamingModule } from './modules/streaming/streaming.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { SearchModule } from './modules/search/search.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ContentModule,
    EpisodesModule,
    GenresModule,
    StreamingModule,
    SubscriptionsModule,
    SearchModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
