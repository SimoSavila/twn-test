import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  CreateIndustryChangeApplicationDto,
  IndustryChangeApplicationDto,
  IndustryChangeApplicationQueryParamsDto,
} from '../dtos';
import { ResidentService } from '../services';

@Controller('/resident-register/industry-change-applications')
@ApiTags('Resident Register')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a new industry change application' })
  async createCustomer(
    @Body() createCustomerDto: CreateIndustryChangeApplicationDto,
  ): Promise<IndustryChangeApplicationDto> {
    return await this.residentService.createResidentChangeApplication(createCustomerDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get resident industry change applications' })
  async getIndustryChangeApplications(
    @Query() query: IndustryChangeApplicationQueryParamsDto,
  ): Promise<IndustryChangeApplicationDto[]> {
    return await this.residentService.getResidentChangeApplications(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get industry change application' })
  async getIndustryChangeApplication(@Param('id') id: string): Promise<IndustryChangeApplicationDto> {
    return await this.residentService.getIndustryChangeApplication(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete industry change applications' })
  async deleteIndustryChangeApplication(@Param('id') id: string): Promise<void> {
    await this.residentService.deleteIndustryChangeApplication(id);
  }
}
