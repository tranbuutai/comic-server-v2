import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HomeModule } from './home/home.module';

@Module({
  imports: [ConfigModule.forRoot(), HomeModule],
})
export class AppModule {}
