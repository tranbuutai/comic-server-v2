import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SearchModule } from './search/search.module';
import { DiscoverModule } from './discover/discover.module';
import { HomeModule } from './home/home.module';
import { TitleModule } from './title/title.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HomeModule,
    TitleModule,
    UserModule,
    DiscoverModule,
    SearchModule,
  ],
})
export class AppModule {}
