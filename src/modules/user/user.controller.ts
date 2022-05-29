import { ComicType } from './../../models/comic';
import { Response, Request } from 'express';
import { Controller, Get, Res, Req, Put, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { updateUser } from '@/models';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/profile/:userId')
  async getProfileUser(@Req() req: Request, @Res() res: Response) {
    return await this.userService.getProfile(req, res);
  }

  @Put('/profile/update/:userId')
  async updateProfileUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: updateUser,
  ) {
    return await this.userService.updateProfileUser(req, res, data);
  }

  @Get('/bookmark/:userId')
  async getListBookmarkUser(@Req() req: Request, @Res() res: Response) {
    return await this.userService.getBookmark(req, res);
  }

  @Get('/history/:userId')
  async getListHistoryUser(@Req() req: Request, @Res() res: Response) {
    return await this.userService.getHistory(req, res);
  }

  @Get('/recommend/:userId')
  async getRecommendUser(@Req() req: Request, @Res() res: Response) {
    return await this.userService.getRecommend(req, res);
  }

  @Put('/genre/:userId')
  async setGenreForUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: string[],
  ) {
    return await this.userService.setGenreForUser(req, res, data);
  }
}
