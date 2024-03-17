import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/services';
import {
  CreateIndustryChangeApplicationDto,
  IndustryChangeApplicationDto,
  IndustryChangeApplicationQueryParamsDto,
} from '../dtos';

@Injectable()
export class ResidentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createResidentChangeApplication(
    data: CreateIndustryChangeApplicationDto,
  ): Promise<IndustryChangeApplicationDto> {
    const resident = await this.prismaService.resident.findFirst({
      select: INDUSTRY_INFORMATION_SELECT,
      where: {
        sub: data.residentSub,
        status: 'ACTIVE',
        typeOfRegistration: { in: ['E_RESIDENCY', 'RESIDENCY'] },
      },
    });

    if (!resident) throw new NotFoundException('Resident not found!');

    if (
      resident.willWorkInPhysicalJurisdiction === data.willWorkInPhysicalJurisdiction &&
      resident.industry === data.industry &&
      resident.regulatoryElection === data.regulatoryElection
    ) {
      throw new BadRequestException('No changes detected!');
    }

    const { residentSub, ...rest } = data;

    const changeApplication = await this.prismaService.$transaction(async (tx) => {
      const result = await tx.industryChangeApplication.create({
        data: {
          residentSub,
          current: { ...resident },
          requested: { set: { ...rest } },
          status: data.willWorkInPhysicalJurisdiction ? 'IN_REVIEW' : 'APPROVED',
          objectStatus: 'CURRENT',
          decision: {
            decidedAt: data.willWorkInPhysicalJurisdiction ? null : new Date(),
            decidedBy: data.willWorkInPhysicalJurisdiction ? null : 'Automatic',
          },
        },
      });

      if (!data.willWorkInPhysicalJurisdiction) {
        await this.prismaService.resident.update({
          where: { sub: data.residentSub },
          data: { ...rest },
        });
      }
      return result;
    });

    return new IndustryChangeApplicationDto(changeApplication);
  }

  async getResidentChangeApplications(
    query: IndustryChangeApplicationQueryParamsDto,
  ): Promise<IndustryChangeApplicationDto[]> {
    const result = await this.prismaService.industryChangeApplication.findMany({
      select: CHANGE_APPLICATION_SELECT,
      where: {
        ...(query.statuses && { status: { in: [...query.statuses] } }),
        residentSub: query.residentSub,
        objectStatus: 'CURRENT',
      },
    });

    return result.map((r) => new IndustryChangeApplicationDto(r));
  }

  async getIndustryChangeApplication(id: string): Promise<IndustryChangeApplicationDto> {
    const result = await this.prismaService.industryChangeApplication.findFirst({
      select: CHANGE_APPLICATION_SELECT,
      where: { id, objectStatus: 'CURRENT' },
    });

    if (!result) throw new Error('Industry change application not found');

    return new IndustryChangeApplicationDto(result);
  }

  async deleteIndustryChangeApplication(id: string): Promise<void> {
    await this.prismaService.industryChangeApplication.update({
      where: { id, status: 'IN_REVIEW' },
      data: { objectStatus: 'DELETED' },
    });
  }
}

const INDUSTRY_INFORMATION_SELECT: Prisma.IndustryInformationSelect = {
  willWorkInPhysicalJurisdiction: true,
  industry: true,
  regulatoryElection: true,
  regulatoryElectionSub: true,
};

const CHANGE_APPLICATION_SELECT: Prisma.IndustryChangeApplicationSelect = {
  id: true,
  residentSub: true,
  status: true,
  submittedAt: true,
  decision: {
    select: {
      decidedAt: true,
      rejectionReason: true,
    },
  },
  objectStatus: true,
  current: {
    select: INDUSTRY_INFORMATION_SELECT,
  },
  requested: {
    select: INDUSTRY_INFORMATION_SELECT,
  },
};
