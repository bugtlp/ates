import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DB_CONNECTION } from './db.provider';
import { Knex } from 'knex';
import { Task } from './interfaces';
import { lastValueFrom } from 'rxjs';
import { MESSAGE_BROKER_CLIENT } from './mb.provider';

@Injectable()
export class AppService {
  private readonly tableName = 'tasks';

  constructor(
    @Inject(DB_CONNECTION) readonly db: Knex,
    @Inject(MESSAGE_BROKER_CLIENT) readonly mbClient: ClientKafka,
  ) {}

  /**
   * Получить список заасайненных задач
   */
  getTasks(employeeId: string): Promise<Task[]> {
    return this.db(this.tableName)
      .select('*')
      .whereNot('completed', true)
      .where('assignee_id', employeeId);
  }

  /**
   * Закрыть задачу
   */
  async completeTask(taskId: string): Promise<void> {
    await this.db(this.tableName)
      .update({ completed: true })
      .where('id', taskId);

    await lastValueFrom(
      this.mbClient.emit(
        'tasks.task_completed',
        JSON.stringify({ id: taskId }),
      ),
    );
  }
}
