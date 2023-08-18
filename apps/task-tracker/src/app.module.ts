import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { HttpController } from './http.controller';
import { AppService } from './app.service';
import {
  dbConnectionProvider,
  messageBrokerClientProvider,
  MESSAGE_BROKER_CLIENT,
} from '../../../libs/common/src';
import { SchemaRegistryModule } from '../../../libs/schema-registry/src';
import { PriceModule } from './price/price.module';
import { KafkaController } from './kafka.controller';

import { OAuth2Strategy } from './oauth2.guard';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    PassportModule,
    PriceModule,
    SchemaRegistryModule,
  ],
  controllers: [HttpController, KafkaController],
  providers: [
    dbConnectionProvider,
    messageBrokerClientProvider,
    OAuth2Strategy,
    AppService,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@Inject(MESSAGE_BROKER_CLIENT) readonly mbClient: ClientKafka) {}

  async onApplicationBootstrap() {
    await this.mbClient.connect();
  }
}
