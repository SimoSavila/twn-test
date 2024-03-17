import { HttpStatus } from '@nestjs/common';
import { ApplicationStatus, Industry, ObjectStatus, RegulatoryElection } from '@prisma/client';
import * as request from 'supertest';

import { PrismaServiceMock } from './mocks/services';
import { setupTestApp, TestApp } from './utils/test.util';
import { RESIDNET_JOHN_DOE } from '../prisma/data';
import { ResidentModule } from '../src/resident-register-industry/resident-register-industry.module';

describe('BackofficeBrandController (e2e)', () => {
  const prismaServiceMock = new PrismaServiceMock();
  const BASE_PATH = '/v1/resident-register/industry-change-applications';

  let app: TestApp;
  let residentSub: string;

  beforeAll(async () => {
    app = await setupTestApp([ResidentModule], [], prismaServiceMock);
  });

  afterAll(async () => {
    await app.nest.close();
  });

  beforeEach(async () => {
    await prismaServiceMock.startTransaction();
    const newuser = await prismaServiceMock.resident.create({ data: { ...RESIDNET_JOHN_DOE } });
    residentSub = newuser.sub;
  });

  afterEach(async () => {
    await prismaServiceMock.rollbackTransaction();
  });

  describe(`${BASE_PATH} (POST)`, () => {
    it(`should return a ${HttpStatus.BAD_REQUEST} if residentSub is not provided`, async () => {
      const { status, body } = await request(app.nest.getHttpServer()).post(BASE_PATH).send({});

      expect(body.message).toEqual([
        'willWorkInPhysicalJurisdiction must be a boolean value',
        'residentSub should not be empty',
      ]);
      expect(status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it(`should return a ${HttpStatus.BAD_REQUEST} if willWorkInPhysicalJurisdiction is true and industry/regulatoryElection are not provided`, async () => {
      const { status, body } = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        residentSub,
        willWorkInPhysicalJurisdiction: true,
      });

      expect(body.message).toEqual([
        'industry must be set if willWorkInPhysicalJurisdiction is true and be a valid enum value',
        'regulatoryElection must be set if willWorkInPhysicalJurisdiction is true and be a valid enum value',
        'regulatoryElectionSub must be set if willWorkInPhysicalJurisdiction is true',
      ]);
      expect(status).toBe(HttpStatus.BAD_REQUEST);
    });

    it(`should return a ${HttpStatus.BAD_REQUEST} if value is same as current`, async () => {
      const { status, body } = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        residentSub,
        willWorkInPhysicalJurisdiction: RESIDNET_JOHN_DOE.willWorkInPhysicalJurisdiction,
        industry: RESIDNET_JOHN_DOE.industry,
        regulatoryElection: RESIDNET_JOHN_DOE.regulatoryElection,
        regulatoryElectionSub: '',
      });

      expect(body.message).toEqual('No changes detected!');
      expect(status).toBe(HttpStatus.BAD_REQUEST);
    });

    it(`should return a ${HttpStatus.BAD_REQUEST} if willWorkInPhysicalJurisdiction is true and regulatoryElection is not from allowed values`, async () => {
      const { status, body } = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        residentSub,
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.ENERGY,
        regulatoryElection: 'Invalid Regulatory Election Value',
      });

      expect(body.message).toEqual([
        'regulatoryElection must be set if willWorkInPhysicalJurisdiction is true and be a valid enum value',
        'regulatoryElectionSub must be set if willWorkInPhysicalJurisdiction is true',
      ]);
      expect(status).toBe(HttpStatus.BAD_REQUEST);
    });

    it(`should return a ${HttpStatus.BAD_REQUEST} if regulatoryElectionSub is provided without willWorkInPhysicalJurisdiction`, async () => {
      const { status, body } = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        residentSub,
        willWorkInPhysicalJurisdiction: false,
        regulatoryElectionSub: 'Some Sub Election',
      });

      expect(body.message).toEqual(['regulatoryElectionSub must be null if willWorkInPhysicalJurisdiction is false']);
      expect(status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should save the record if all required fields are provided and willWorkInPhysicalJurisdiction is true', async () => {
      const data = {
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.ENERGY,
        regulatoryElection: RegulatoryElection.CHILE,
        regulatoryElectionSub: 'Some Sub Election',
      };
      const { status, body } = await request(app.nest.getHttpServer())
        .post(BASE_PATH)
        .send({ ...data, residentSub });

      expect(body).toMatchObject({
        residentSub,
        status: 'IN_REVIEW',
        objectStatus: 'CURRENT',
        decision: {
          decidedAt: null,
          rejectionReason: null,
        },
        requested: data,
      });
      expect(status).toBe(HttpStatus.CREATED);
    });

    it('should save the record if all required fields are provided and willWorkInPhysicalJurisdiction is false', async () => {
      const { status, body } = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        residentSub: residentSub,
        willWorkInPhysicalJurisdiction: false,
        industry: null,
        regulatoryElection: null,
      });

      const resident = await prismaServiceMock.resident.findFirst({ where: { sub: residentSub } });

      expect(body).toMatchObject({
        residentSub,
        status: ApplicationStatus.APPROVED,
        objectStatus: 'CURRENT',
      });
      expect(resident.willWorkInPhysicalJurisdiction).toEqual(false);
      expect(resident.industry).toEqual(null);
      expect(status).toEqual(HttpStatus.CREATED);
    });
  });

  describe(`${BASE_PATH} (GET)`, () => {
    it('should give error message if no residentSub is provided', async () => {
      const { status, body } = await request(app.nest.getHttpServer()).get(BASE_PATH);

      expect(body.message).toEqual(['residentSub should not be empty']);
      expect(status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should return resident industry change application', async () => {
      const data = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.ENERGY,
        regulatoryElection: RegulatoryElection.CHILE,
        regulatoryElectionSub: 'Some Sub Election',
        residentSub,
      });

      const { status, body } = await request(app.nest.getHttpServer()).get(`${BASE_PATH}?residentSub=${residentSub}`);

      expect([data.body]).toEqual(body);
      expect(status).toBe(HttpStatus.OK);
    });

    it('should return resident both resident change applications', async () => {
      const response1 = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.ENERGY,
        regulatoryElection: RegulatoryElection.CHILE,
        regulatoryElectionSub: 'Some Sub Election',
        residentSub,
      });

      const response2 = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        residentSub: residentSub,
        willWorkInPhysicalJurisdiction: false,
        industry: null,
        regulatoryElection: null,
      });
      const { status, body } = await request(app.nest.getHttpServer()).get(
        `${BASE_PATH}?residentSub=${residentSub}&statuses=${ApplicationStatus.IN_REVIEW}&statuses=${ApplicationStatus.APPROVED}`,
      );

      expect([response1.body, response2.body]).toEqual(body);
      expect(status).toBe(HttpStatus.OK);
    });

    it(`should return resident industry change application where status is ${ApplicationStatus.IN_REVIEW}`, async () => {
      const response1 = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.ENERGY,
        regulatoryElection: RegulatoryElection.CHILE,
        regulatoryElectionSub: 'Some Sub Election',
        residentSub,
      });

      await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        residentSub: residentSub,
        willWorkInPhysicalJurisdiction: false,
        industry: null,
        regulatoryElection: null,
      });
      const { status, body } = await request(app.nest.getHttpServer()).get(
        `${BASE_PATH}?residentSub=${residentSub}&statuses=${ApplicationStatus.IN_REVIEW}`,
      );

      expect([response1.body]).toEqual(body);
      expect(status).toBe(HttpStatus.OK);
    });
  });

  describe(`${BASE_PATH}/{id} (GET)`, () => {
    it('should give error message if no application  is provided', async () => {
      const response = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.ENERGY,
        regulatoryElection: RegulatoryElection.CHILE,
        regulatoryElectionSub: 'Some Sub Election',
        residentSub,
      });

      const { status, body } = await request(app.nest.getHttpServer()).get(`${BASE_PATH}/${response.body.id}`);

      expect(response.body).toEqual(body);

      expect(status).toBe(HttpStatus.OK);
    });
  });

  describe(`${BASE_PATH}/{id} (DELETE)`, () => {
    it('should delete industry change application', async () => {
      const response = await request(app.nest.getHttpServer()).post(BASE_PATH).send({
        willWorkInPhysicalJurisdiction: true,
        industry: Industry.ENERGY,
        regulatoryElection: RegulatoryElection.CHILE,
        regulatoryElectionSub: 'Some Sub Election',
        residentSub,
      });

      const { status } = await request(app.nest.getHttpServer()).delete(`${BASE_PATH}/${response.body.id}`);
      const data = await prismaServiceMock.industryChangeApplication.findFirst({ where: { id: response.body.id } });
      expect(data.objectStatus).toEqual(ObjectStatus.DELETED);
      expect(status).toBe(HttpStatus.OK);
    });
  });
});
