import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', 'placeholder'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', 'placeholder'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL', 'http://localhost:4000/api/v1/auth/google/callback'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: { emails: Array<{ value: string }>; displayName: string; id: string },
    done: VerifyCallback,
  ) {
    const user = {
      email: profile.emails[0]?.value || '',
      name: profile.displayName,
      provider: 'google',
      providerId: profile.id,
    };
    done(null, user);
  }
}
