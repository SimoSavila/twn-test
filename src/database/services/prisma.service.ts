import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { databaseConfigFactory } from '../database-config.factory';
import { DatabaseConfig } from '../database-config.schema';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(databaseConfigFactory.KEY) databaseConfig: DatabaseConfig) {
    super(databaseConfig.logLevels ? { log: databaseConfig.logLevels } : {});
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
