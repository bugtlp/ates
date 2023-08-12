import { Strategy, VerifyCallback } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      authorizationURL: 'http://localhost:3000/oauth/authorize?state=random',
      tokenURL: 'http://localhost:3000/oauth/token',
      clientID: 'task-tracker-client-id',
      clientSecret: '123ABC',
      callbackURL: 'http://localhost:3001/oauth/callback',
      secretOrKey: '123ABC',
      // state: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    return done(null, {
      accessToken,
      refreshToken,
      profile,
    });
  }
}

@Injectable()
export class OAuth2Guard extends AuthGuard('oauth2') {}
