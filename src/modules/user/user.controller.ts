import { Controller, Get, Res, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/:userId')
  async getListUserPage(@Req() req: Request, @Res() res: Response) {
    return await this.userService.getBookmark(req, res);
  }
}
