import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'task-tracker',
        brokers: [config.get('KAFKA_BROKER')],
      },
      consumer: {
        groupId: 'task-tracker-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(Number(config.get('PORT')) || 3000);
}
bootstrap();
