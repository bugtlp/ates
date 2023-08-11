import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Knex } from 'knex';
import { DB_CONNECTION } from '../../../libs/common/src';
import { UserCreatedEvent } from './interfaces';

@Controller()
export class KafkaController {
  constructor(@Inject(DB_CONNECTION) private readonly db: Knex) {}

  @EventPattern('auth.user.created')
  async handleUserCreated(@Payload() event: UserCreatedEvent): Promise<void> {
    const { id, role } = event;
    await this.db('employees').insert({ id, role });
  }
}
