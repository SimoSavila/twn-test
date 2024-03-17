import { Expose, plainToInstance } from 'class-transformer';

export class DecisionDto {
  @Expose()
  readonly decidedAt?: Date;

  @Expose()
  readonly rejectionReason?: string;

  constructor(args: DecisionDto) {
    Object.assign(
      this,
      plainToInstance(DecisionDto, args, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
