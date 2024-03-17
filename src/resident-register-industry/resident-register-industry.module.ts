import { Module } from '@nestjs/common';

import { ResidentController } from './controllers';
import { ResidentService } from './services/';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ResidentController],
  providers: [ResidentService],
})
export class ResidentModule {}
