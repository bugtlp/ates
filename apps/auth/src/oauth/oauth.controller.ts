import { Controller, Get, Post } from '@nestjs/common';
import {
  OAuth2ServerAuthenticate,
  OAuth2ServerAuthorize,
  OAuth2ServerToken,
  OAuth2ServerOAuth,
  OAuth,
  OAuth2ServerOptions,
} from 'nest-oauth2-server';

let authenticateHandler = {
  handle: function (request, response) {
    // Здесь мы должны получить пользователя из сессии
    return {};
  },
};

@Controller('oauth')
export class OAuthController {
  @Get('user')
  @OAuth2ServerAuthenticate()
  user(@OAuth2ServerOAuth() oauth: OAuth) {
    return oauth.token?.user;
  }

  @Get('authorize')
  @OAuth2ServerOptions({ authenticateHandler })
  @OAuth2ServerAuthorize()
  authorize() {}

  @Post('token')
  @OAuth2ServerToken()
  token() {}
}
