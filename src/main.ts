import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './common/envs';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.PORT).then(() => logger.log(`Application listening on port ${envs.PORT}`));
  
}
bootstrap();
