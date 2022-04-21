import { Controller, Get, Res, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/title/:title')
  async searchTitle(@Req() req: Request, @Res() res: Response) {
    return await this.searchService.searchTitle(req, res);
  }
  @Get('/author/:author')
  async searchAuthor(@Req() req: Request, @Res() res: Response) {
    return await this.searchService.searchAuthor(req, res);
  }
}
