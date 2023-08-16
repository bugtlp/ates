import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuth2ServerModule } from 'nest-oauth2-server';

@Module({
  imports: [
    OAuth2ServerModule.forRootAsync({
      imports: [OAuthModule],
      useFactory: (model: OAuthService) => ({
        model: model,
      }),
      inject: [OAuthService],
    }),
  ],
  controllers: [OAuthController],
  exports: [OAuthService],
  providers: [OAuthService],
})
export class OAuthModule {}
