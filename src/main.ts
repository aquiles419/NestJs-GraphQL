import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RechargeCronService } from './utils/recharge-cron.service';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const stationsService = app.get(RechargeCronService);

  // Iniciar o cron job
  stationsService.startCronJob();
  dotenv.config();

  await app.listen(3000);
}
bootstrap();
