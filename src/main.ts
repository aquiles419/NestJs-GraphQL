import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RechargesService } from './recharges/recharges.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const stationsService = app.get(RechargesService);

  // Iniciar o cron job
  stationsService.startCronJob();

  await app.listen(3000);
}
bootstrap();
