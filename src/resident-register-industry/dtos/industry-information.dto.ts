import { ApiProperty } from '@nestjs/swagger';
import { Industry, RegulatoryElection } from '@prisma/client';
import { Expose, plainToInstance } from 'class-transformer';

export class IndustryInformationDto {
  @Expose()
  readonly willWorkInPhysicalJurisdiction: boolean;

  @ApiProperty({ enum: Industry })
  @Expose()
  readonly industry: Industry | null;

  @ApiProperty({ enum: RegulatoryElection })
  @Expose()
  readonly regulatoryElection: RegulatoryElection | null;

  @Expose()
  readonly regulatoryElectionSub?: string;

  constructor(args: IndustryInformationDto) {
    Object.assign(
      this,
      plainToInstance(IndustryInformationDto, args, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
