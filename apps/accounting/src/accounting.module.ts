import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import {
  dbConnectionProvider,
  messageBrokerClientProvider,
  MESSAGE_BROKER_CLIENT,
} from '../../../libs/common/src';

import { HttpController } from './http.controller';
import { AccountingService } from './accounting.service';

@Module({
  imports: [ConfigModule.forRoot({}), PassportModule],
  controllers: [HttpController],
  providers: [
    dbConnectionProvider,
    messageBrokerClientProvider,
    AccountingService,
  ],
})
export class AccountingModule implements OnApplicationBootstrap {
  constructor(@Inject(MESSAGE_BROKER_CLIENT) readonly mbClient: ClientKafka) {}

  async onApplicationBootstrap() {
    await this.mbClient.connect();
  }
}
