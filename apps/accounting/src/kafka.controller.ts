import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Knex } from 'knex';
import { DB_CONNECTION } from '../../../libs/common/src';
import { SchemaRegistryService } from '../../../libs/schema-registry/src';
import { EmployeeCreatedEvent, TaskCreatedEvent } from './interfaces';

@Controller()
export class KafkaController {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: Knex,
    private readonly schemaRegistry: SchemaRegistryService,
  ) {}

  @EventPattern('employee-stream')
  async handleEmployeeCreated(
    @Payload() event: EmployeeCreatedEvent,
  ): Promise<void> {
    const { id, role } = this.schemaRegistry.decode(event, 'employee-stream');
    await this.db('employees').insert({ public_id: id, role });
  }

  @EventPattern('task-stream')
  async handleTaskCreated(@Payload() event: TaskCreatedEvent): Promise<void> {
    const { id, assignee_id, ...properties } = this.schemaRegistry.decode(
      event,
      'task-stream',
    );
    await this.db('tasks').insert({
      public_id: id,
      assignee_id: this.db.raw(
        'select id from employees where public_id = ?',
        assignee_id,
      ),
      ...properties,
    });
  }

  @EventPattern('task_live_cycle.task_added')
  async handleTaskAdded(@Payload() event: any): Promise<void> {
    const data = this.schemaRegistry.decode(
      event,
      'task_live_cycle.task_added',
    );
    // TODO: записываем в аудит лог и пересчитываем баланс
  }
}
