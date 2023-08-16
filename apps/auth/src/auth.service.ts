import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Knex } from 'knex';

import { AddEmployeeDto, Employee } from './interfaces';
import { DB_CONNECTION, MESSAGE_BROKER_CLIENT } from '../../../libs/common/src';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: Knex,
    @Inject(MESSAGE_BROKER_CLIENT) private readonly mbClient: ClientKafka,
  ) {}

  /**
   * Получить всех сотрудников
   */
  getEmployees(): Promise<Employee[]> {
    return this.db('employees').select('*');
  }

  /**
   * Добавление нового сотрудника
   */
  async addEmployee(params: AddEmployeeDto): Promise<void> {
    const [{ id: employeeId }] = await this.db('employees')
      .insert(params)
      .returning('id');

    // Кидаем CUD событие СотрудникСоздан
    await lastValueFrom(
      this.mbClient.emit(
        'employee-stream',
        JSON.stringify({
          id: employeeId,
          login: params.login,
          role: params.role,
        }),
      ),
    );

    // Кидаем бизнес событие СотрудникДобавлен
    await lastValueFrom(
      this.mbClient.emit(
        'employee_added',
        JSON.stringify({
          id: employeeId,
          role: params.role,
        }),
      ),
    );
  }
}
