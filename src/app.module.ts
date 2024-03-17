import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { ResidentModule } from './resident-register-industry/resident-register-industry.module';

@Module({
  imports: [DatabaseModule, ResidentModule],
})
export class AppModule {}
