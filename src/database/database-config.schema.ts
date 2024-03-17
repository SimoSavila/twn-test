import { Transform } from 'class-transformer';
import { ArrayUnique, IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class DatabaseConfig {
  @Transform(({ value }) => value?.split(','))
  @IsArray()
  @IsIn(['error', 'info', 'query', 'warn'], { each: true })
  @ArrayUnique()
  readonly logLevels!: Array<'error' | 'info' | 'query' | 'warn'>;

  @IsString()
  @IsNotEmpty()
  readonly url!: string;
}
