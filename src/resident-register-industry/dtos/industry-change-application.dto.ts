import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus, ObjectStatus } from '@prisma/client';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { DecisionDto, IndustryInformationDto } from '../dtos';

export class IndustryChangeApplicationDto {
  @Expose()
  readonly id!: string;

  @IsNotEmpty()
  @Expose()
  readonly residentSub!: string;

  @ApiProperty({ enum: ApplicationStatus })
  @Expose()
  readonly status!: ApplicationStatus;

  @Expose()
  readonly submittedAt!: Date | null;

  @ApiProperty({ enum: ObjectStatus })
  @Expose()
  readonly objectStatus!: ObjectStatus;

  @Expose()
  @Type(() => DecisionDto)
  readonly decision!: DecisionDto;

  @Expose()
  readonly current!: IndustryInformationDto;

  @Expose()
  readonly requested!: IndustryInformationDto;

  constructor(args: IndustryChangeApplicationDto) {
    Object.assign(
      this,
      plainToInstance(IndustryChangeApplicationDto, args, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
