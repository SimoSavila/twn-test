import { DynamicModule, ForwardReference, INestApplication, Provider, Type } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { Response } from 'supertest';

import { PrismaService } from '../../src/database/services';
import { configureApp } from '../../src/utils/app.util';
import { PrismaServiceMock } from '../mocks/services';

export interface TestApp {
  readonly nest: INestApplication;
}

export type TestAppImport = Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;

export type SuperTestResponse<T> = Omit<Response, 'body'> & { body: T };

export async function setupTestApp(
  imports: TestAppImport[] = [],
  providers: Provider[] = [],
  prismaServiceMock: PrismaServiceMock,
): Promise<TestApp> {
  const module = await Test.createTestingModule({
    imports: [
      // default imports here
      ...imports,
    ],
    providers: [...providers],
  })
    .overrideProvider(PrismaService)
    .useValue(prismaServiceMock)
    .compile();

  // create and initiate application
  const app = module.createNestApplication<NestExpressApplication>();

  configureApp(app);

  await app.init();

  return { nest: app };
}
