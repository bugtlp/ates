import {
  Controller,
  Get,
  Post,
  Inject,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { DB_CONNECTION } from './db.provider';
import { Knex } from 'knex';
import { Task } from './interfaces';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(DB_CONNECTION) readonly dbConnection: Knex,
  ) {}

  @Get()
  getTasks(@Request() req: Request): Promise<Task[]> {
    const employeeId = '95086ab6-36f2-11ee-ad0c-c19e809d8a5c';

    return this.appService.getTasks(employeeId);
  }

  @Post('add')
  async addTask(): Promise<void> {
    // Проверка на заполненность описания
    // Назначаем рандомного исполнителя
    // Расчитываем цены
    // Добавляем таск в БД
    // Кидаем CUD событие TaskCreated (id, assignee_id, price...)
    // Кидаем бизнес событие TaskAdded (id, assignee_id)

    const trx = await this.dbConnection.transaction();
    await trx('users').insert({ name: 'user1', password: '123' });
    trx.rollback();
    // trx.query('tableName').select();
    return this.dbConnection('users').select(['*']);
  }

  @Post('complete')
  async completeTask(@Body('id') taskId: string): Promise<void> {
    const employeeId = '95086ab6-36f2-11ee-ad0c-c19e809d8a5c';

    console.log('taskId', taskId);
    // Проверка что задача пользователя (Guard)

    return this.appService.completeTask(taskId);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/auth/login')
  async login(@Request() req: Request) {
    // console.log(req.user);
    return 'Yes';
  }
}
