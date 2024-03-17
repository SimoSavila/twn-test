import { ApiProperty, PickType } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ArrayUnique, IsOptional } from 'class-validator';

import { IndustryChangeApplicationDto } from './industry-change-application.dto';

export class IndustryChangeApplicationQueryParamsDto extends PickType(IndustryChangeApplicationDto, [
  'residentSub',
] as const) {
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @ApiProperty({ enum: ApplicationStatus, isArray: true, required: false })
  readonly statuses!: ApplicationStatus[] | null;
}
