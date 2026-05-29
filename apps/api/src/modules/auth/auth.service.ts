import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        profile: { create: {} },
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async validateOAuthLogin(profile: { email: string; name: string; provider: string; providerId: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          emailVerified: true,
          profile: { create: {} },
          oauthAccounts: {
            create: {
              provider: profile.provider,
              providerId: profile.providerId,
            },
          },
        },
      });
    } else {
      const oauthAccount = await this.prisma.oAuthAccount.findUnique({
        where: {
          provider_providerId: {
            provider: profile.provider,
            providerId: profile.providerId,
          },
        },
      });

      if (!oauthAccount) {
        await this.prisma.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: profile.provider,
            providerId: profile.providerId,
          },
        });
      }
    }

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshToken(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(session.user.id, session.user.email);

    await this.prisma.session.delete({ where: { id: session.id } });

    return tokens;
  }

  async logout(userId: string, token: string) {
    await this.prisma.session.deleteMany({
      where: { userId, token },
    });
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    await this.prisma.session.create({
      data: {
        userId,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: { id: string; email: string; name: string | null; role: string; avatar: string | null }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };
  }
}
