import { Inject, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

import {
  CommonModule,
  MESSAGE_BROKER_CLIENT,
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
export class AuthModule {
  constructor(@Inject(MESSAGE_BROKER_CLIENT) readonly mbClient: ClientKafka) {}

  async onApplicationBootstrap() {
    await this.mbClient.connect();
  }
}
