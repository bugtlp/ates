import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Task, AddTaskDto } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTasks(@Request() req: Request): Promise<Task[]> {
    const employeeId = '95086ab6-36f2-11ee-ad0c-c19e809d8a5c';

    return this.appService.getTasks(employeeId);
  }

  @Post('add')
  async addTask(@Body() params: AddTaskDto): Promise<void> {
    // Проверка на заполненность описания

    return this.appService.addTask(params);
  }

  @Post('complete')
  async completeTask(@Body('id') taskId: string): Promise<void> {
    const employeeId = '95086ab6-36f2-11ee-ad0c-c19e809d8a5c';
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
