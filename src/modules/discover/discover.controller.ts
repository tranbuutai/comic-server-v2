import { Controller, Get, Res, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

import { DiscoverService } from './discover.service';

@Controller('discover')
export class DiscoverController {
  constructor(
    private readonly discoverService: DiscoverService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getAllComic(@Res() res: Response) {
    return await this.discoverService.getAll(res);
  }
  @Get('/getMore')
  async paginationPage(@Req() req: Request, @Res() res: Response) {
    return await this.discoverService.getMore(req, res);
  }
  @Get('/filter')
  async filterPage(@Req() req: Request, @Res() res: Response) {
    return await this.discoverService.filter(req, res);
  }
}
