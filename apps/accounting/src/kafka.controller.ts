import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Knex } from 'knex';
import { DB_CONNECTION } from '../../../libs/common/src';
import { EmployeeCreatedEvent } from './interfaces';

@Controller()
export class KafkaController {
  constructor(@Inject(DB_CONNECTION) private readonly db: Knex) {}

  @EventPattern('employee-stream')
  async handleEmployeeCreated(
    @Payload() event: EmployeeCreatedEvent,
  ): Promise<void> {
    const { id, role } = event;
    await this.db('employees').insert({ id, role });
  }
}
