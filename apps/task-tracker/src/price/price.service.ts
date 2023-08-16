import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceService {
  /**
   * Расчет цены списания за назначения задачи.
   */
  calcPriceAssignee(): number {
    return (Math.floor(Math.random() * 20) + 10) * -1;
  }

  /**
   * Расчет цены вознаграждения за завершения задачи
   */
  calcPriceCompleted(): number {
    return Math.floor(Math.random() * 40) + 20;
  }
}
