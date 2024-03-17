import { registerAs } from '@nestjs/config';

import { DatabaseConfig } from './database-config.schema';
import { ConfigUtil } from '../common/utils/config.util';

export const databaseConfigFactory = registerAs('database', (): DatabaseConfig => {
  return ConfigUtil.validate(DatabaseConfig, {
    logLevels: <string>process.env['DATABASE_LOG_LEVELS'],
    url: <string>process.env['DATABASE_URL'],
  });
});
