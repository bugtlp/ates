import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AddEmployeeDto, Employee } from './interfaces';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  getEmployees(): Promise<Employee[]> {
    return this.authService.getEmployees();
  }

  @Post('/add')
  async addEmployee(
    @Body() params: AddEmployeeDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.addEmployee(params);
    res.redirect('/');
  }
}
