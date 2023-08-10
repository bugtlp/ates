import { Module } from '@nestjs/common';
import { PriceService } from './price.service';

/**
 * Генерация цены на таск вынесено отдельным модулем так как
 * это отдельная бизнес логика в другом контексте
 */
@Module({
  exports: [PriceService],
  providers: [PriceService],
})
export class PriceModule {}
