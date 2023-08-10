import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConnectionProvider } from './db.provider';
import { join } from 'path';
import {
  MESSAGE_BROKER_CLIENT,
  messageBrokerClientProvider,
} from './mb.provider';
import { PriceModule } from './price/price.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(__dirname, '../', '.env'),
      ],
    }),
    PriceModule,
  ],
  controllers: [AppController],
  providers: [dbConnectionProvider, messageBrokerClientProvider, AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@Inject(MESSAGE_BROKER_CLIENT) readonly mbClient: ClientKafka) {}

  async onApplicationBootstrap() {
    await this.mbClient.connect();
  }
}
