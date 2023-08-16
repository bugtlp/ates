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
export class HttpController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTasks(@Request() req: Request): Promise<Task[]> {
    // Достаем пользователя из сессии
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
    // Достаем пользователя из сессии
    const employeeId = '95086ab6-36f2-11ee-ad0c-c19e809d8a5c';
    // Проверка что задача пользователя (Guard)

    return this.appService.completeTask(taskId);
  }

  @UseGuards(AuthGuard('oauth2'))
  @Get('oauth/login')
  login() {}

  @UseGuards(AuthGuard('oauth2'))
  @Get('oauth/callback')
  async callback(@Request() req: Request, res: Response) {
    // Сохраняем пользователя в сессию
    // console.log(req.user);
  }
}
