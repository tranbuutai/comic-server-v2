import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { HomeService } from './home.service';
@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getListHomePage(@Res() res: Response) {
    return await this.homeService.getAll(res);
  }
}
