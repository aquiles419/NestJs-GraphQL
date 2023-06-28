import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class RechargeCronService {
  constructor(private prisma: PrismaService) {}

  startCronJob() {
    // Define a expressão cron para rodar a cada minuto
    const cronExpression = '* * * * *';

    // Cria o cron job
    const cronJob = new CronJob(cronExpression, async () => {
      await this.checkRechargeStatus();
    });

    // Inicia o cron job
    cronJob.start();
  }

  async checkRechargeStatus() {
    // Obtém todas as recargas ativas (ainda em andamento)
    const activeRecharges = await this.prisma.recharge.findMany({
      where: {
        finishDateTime: {
          lte: new Date(),
        },
      },
    });

    // Atualiza o status das estações correspondentes
    for (const recharge of activeRecharges) {
      const station = await this.prisma.station.findUnique({
        where: { id: recharge.stationId },
      });

      if (station) {
        await this.prisma.station.update({
          where: { id: station.id },
          data: { stationStatus: 'AVAILABLE' },
        });
      }
    }
  }
}
