import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import {
  CommonModule,
  dbConnectionProvider,
  messageBrokerClientProvider,
} from '../../../libs/common/src';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    ServeStaticModule.forRoot({
      rootPath: 'public/auth',
      exclude: ['/add'],
    }),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [dbConnectionProvider, messageBrokerClientProvider, AuthService],
})
export class AuthModule {}
