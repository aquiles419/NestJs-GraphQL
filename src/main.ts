import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StationsService } from './stations/stations.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const stationsService = app.get(StationsService);

  // Iniciar o cron job
  stationsService.startCronJob();

  await app.listen(3000);
}
bootstrap();
