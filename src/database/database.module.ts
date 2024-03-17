import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { databaseConfigFactory } from './database-config.factory';
import { PrismaService } from './services';

@Module({
  imports: [ConfigModule.forFeature(databaseConfigFactory)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
