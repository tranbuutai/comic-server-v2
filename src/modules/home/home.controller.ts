import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { HomeService } from './home.service';

const convertsData = (querySnapshot) => {
  if (!querySnapshot) return [];
  const data = [];
  querySnapshot.forEach((doc) => {
    const item = {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate(),
      updatedAt: doc.data()?.updatedAt?.toDate(),
    };
    data.push(item);
  });
  return data;
};

@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getListHomePage(@Res() res: Response) {
    const data = convertsData(await this.homeService.getHello());
    return res.json(data);
  }
}
