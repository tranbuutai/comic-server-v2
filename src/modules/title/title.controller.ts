import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

import { TitleService } from './title.service';

@Controller('titles')
export class TitleController {
  constructor(
    private readonly titleService: TitleService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getAllTitle(@Res() res: Response) {
    return await this.titleService.getAllTitle(res);
  }
  @Get('/:id')
  async getOneTitle(@Req() req: Request, @Res() res: Response) {
    return await this.titleService.getOneTitle(req, res);
  }
  @Get('/:id/view/:idChap')
  async getChapter(@Req() req: Request, @Res() res: Response) {
    return await this.titleService.getChap(req, res);
  }
}
