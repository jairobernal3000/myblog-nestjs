import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import { PORT } from './config/constants';
import { setDefaultUser, generateTypeormConfigFile } from './scripts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>(PORT), 10) || 3000;

  initSwagger(app);
  await setDefaultUser(config);
  generateTypeormConfigFile(config);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(port);
  logger.log(`[Init] Server is running in localhost:${await app.getUrl()}`);
}
bootstrap();
