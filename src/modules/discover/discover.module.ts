import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DiscoverController } from './discover.controller';
import { DiscoverService } from './discover.service';

@Module({
  imports: [ConfigModule],
  controllers: [DiscoverController],
  providers: [DiscoverService],
})
export class DiscoverModule {}
