import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export class ConfigUtil {
  static validate<T extends Record<string, any>>(configClass: new () => T, config: Record<string, unknown>): T {
    const validatedConfig = plainToInstance(configClass, config);
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) throw new Error(errors.toString());

    return validatedConfig;
  }
}
