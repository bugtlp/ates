import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Knex } from 'knex';

import { AddTaskDto, NewTask, Task } from './interfaces';
import { DB_CONNECTION, MESSAGE_BROKER_CLIENT } from '../../../libs/common/src';
import { PriceService } from './price/price.service';

@Injectable()
export class AppService {
  private readonly tableName = 'tasks';

  constructor(
    @Inject(DB_CONNECTION) private readonly db: Knex,
    @Inject(MESSAGE_BROKER_CLIENT) private readonly mbClient: ClientKafka,
    private readonly priceService: PriceService,
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
   * Добавить задачу
   */
  async addTask(params: AddTaskDto): Promise<void> {
    const { description, jiraId } = params;

    // Назначаем рандомного исполнителя
    const assignee = await this.getRandomAssignee();

    if (!assignee) {
      throw new Error('Assignee not found');
    }

    // Расчитываем цены
    const priceAssignee = this.priceService.calcPriceAssignee();
    const priceCompleted = this.priceService.calcPriceCompleted();

    const task: NewTask = {
      jira_id: jiraId,
      description,
      price_assignee: priceAssignee,
      price_completed: priceCompleted,
      assignee_id: assignee.id,
    };

    const [{ taskId }] = await this.db(this.tableName)
      .insert(task)
      .returning('id');

    // Кидаем CUD событие ЗадачаСоздана
    await lastValueFrom(
      this.mbClient.emit(
        'task-stream',
        JSON.stringify({
          id: taskId,
          jira_id: jiraId,
          description,
          price_assignee: priceAssignee,
          price_completed: priceCompleted,
          assignee_id: assignee.id,
        }),
      ),
    );

    // Кидаем бизнес событие ЗадачаДобавлена
    await lastValueFrom(
      this.mbClient.emit(
        'task_live_cycle.task_added',
        JSON.stringify({
          id: taskId,
          assignee_id: assignee.id,
        }),
      ),
    );
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
        'task_live_cycle.task_completed',
        JSON.stringify({ id: taskId }),
      ),
    );
  }

  /**
   * Вычисляет случайного исполнителя
   */
  private getRandomAssignee(): Promise<{ id: string } | null> {
    return this.db('employees')
      .first('id')
      .whereNotIn('role', ['manager', 'admin'])
      .orderByRaw('random()');
  }
}
