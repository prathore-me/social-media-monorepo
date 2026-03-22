import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CleanupService } from './cleanup/cleanup.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('CleanupJob');
  logger.log('Cleanup job starting...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const cleanupService = app.get(CleanupService);

  try {
    await cleanupService.runAll();
    logger.log('Cleanup job finished successfully');
  } catch (error) {
    logger.error('Cleanup job failed', error);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
