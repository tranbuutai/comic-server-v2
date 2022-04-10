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

  @Get('/profile/:userId')
  async getProfileUser(@Req() req: Request, @Res() res: Response) {
    return await this.userService.getProfile(req, res);
  }

  @Get('/bookmark/:userId')
  async getListBookmarkUser(@Req() req: Request, @Res() res: Response) {
    return await this.userService.getBookmark(req, res);
  }
}
