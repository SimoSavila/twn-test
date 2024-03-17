import { ApiProperty, PickType } from '@nestjs/swagger';
import { Industry, RegulatoryElection } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

import { IndustryChangeApplicationDto } from './industry-change-application.dto';
import { MustBeSetIfTrue, MustBeSetIfTrueAndIsEnum } from '../../common/decorators/null-value.decorator';

export class CreateIndustryChangeApplicationDto extends PickType(IndustryChangeApplicationDto, [
  'residentSub',
] as const) {
  @IsBoolean()
  @Type(() => Boolean)
  readonly willWorkInPhysicalJurisdiction!: boolean;

  @MustBeSetIfTrueAndIsEnum(Industry)
  @ApiProperty({ enum: Industry })
  readonly industry!: Industry | null;

  @MustBeSetIfTrueAndIsEnum(RegulatoryElection)
  @ApiProperty({ enum: RegulatoryElection })
  readonly regulatoryElection!: RegulatoryElection | null;

  @MustBeSetIfTrue()
  readonly regulatoryElectionSub!: string | null;
}
