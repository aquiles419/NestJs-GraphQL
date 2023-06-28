import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RechargeCronService } from './utils/recharge-cron.service';
import * as moment from 'moment-timezone';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const stationsService = app.get(RechargeCronService);

  moment.tz.setDefault('America/Sao_Paulo');


  // Iniciar o cron job
  stationsService.startCronJob();

  await app.listen(3000);
}
bootstrap();
