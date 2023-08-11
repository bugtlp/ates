import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { HttpController } from './http.controller';
import { AppService } from './app.service';
import {
  CommonModule,
  dbConnectionProvider,
  messageBrokerClientProvider,
  MESSAGE_BROKER_CLIENT,
} from '../../../libs/common/src';
import { PriceModule } from './price/price.module';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [ConfigModule.forRoot({}), PriceModule, CommonModule],
  controllers: [HttpController, KafkaController],
  providers: [dbConnectionProvider, messageBrokerClientProvider, AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@Inject(MESSAGE_BROKER_CLIENT) readonly mbClient: ClientKafka) {}

  async onApplicationBootstrap() {
    await this.mbClient.connect();
  }
}
