import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AccountingModule } from './accounting.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AccountingModule);
  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.get('KAFKA_CLIENT_ID'),
        brokers: [config.get('KAFKA_BROKER')],
      },
      consumer: {
        groupId: config.get('KAFKA_CONSUMER_GROUP_ID'),
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(Number(config.get('PORT')) || 3000);
}
bootstrap();
