import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Knex } from 'knex';
import { DB_CONNECTION } from '../../../libs/common/src';
import { EmployeeCreatedEvent, TaskCreatedEvent } from './interfaces';

@Controller()
export class KafkaController {
  constructor(@Inject(DB_CONNECTION) private readonly db: Knex) {}

  @EventPattern('employee-stream')
  async handleEmployeeCreated(
    @Payload() event: EmployeeCreatedEvent,
  ): Promise<void> {
    const { id, role } = event;
    await this.db('employees').insert({ public_id: id, role });
  }

  @EventPattern('task-stream')
  async handleTaskCreated(@Payload() event: TaskCreatedEvent): Promise<void> {
    const { id, assignee_id, ...properties } = event;
    await this.db('tasks').insert({
      public_id: id,
      assignee_id: this.db.raw(
        'select id from employees where public_id = ?',
        assignee_id,
      ),
      ...properties,
    });
  }
}
