import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TitleController } from './title.controller';
import { TitleService } from './title.service';

@Module({
  imports: [ConfigModule],
  controllers: [TitleController],
  providers: [TitleService],
})
export class TitleModule {}
