import { Controller, Get } from '@nestjs/common';
import { AccountingService } from './accounting.service';

@Controller()
export class HttpController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get()
  getHello(): string {
    return this.accountingService.getHello();
  }
}
