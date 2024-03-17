import { INestApplication, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '../app.module';

const logger = new Logger('App');

export async function setupApp() {
  logger.log('setting up application');

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  configureApp(app);
  // start the server
  await app.listen(3000);
}

/**
 * Configures the app with middlewares, pipelines etc.
 * Shared between production and testing applications
 * @param app App to configure
 */
export function configureApp(app: NestExpressApplication) {
  // use global validation pipe that enables class-validator
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableCors({ origin: '*' });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  setupSwagger(app, 'documentation');

  app.enableShutdownHooks();
}

function setupSwagger(app: INestApplication, endpoint = '/') {
  // configure swagger document
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TWN API')
    .setDescription('TWN backend test API')
    .setExternalDoc('OpenApi YAML', 'documentation-yaml')
    .setVersion('1.0')
    .build();

  // swagger options
  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
    },
  };

  // create swagger document
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // show the documentation on requested endpoint
  SwaggerModule.setup(endpoint, app, swaggerDocument, options);
}
