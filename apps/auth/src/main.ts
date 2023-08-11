import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const config = app.get(ConfigService);
  await app.listen(Number(config.get('PORT')) || 3000);
}
bootstrap();
