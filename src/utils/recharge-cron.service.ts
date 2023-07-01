import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class RechargeCronService {
  constructor(private prisma: PrismaService) {}

  startCronJob() {
    // Define o cron para rodar a cada minuto
    const cronExpression = '* * * * *';

    const cronJob = new CronJob(cronExpression, async () => {
      await this.checkRechargeStatus();
    });

    cronJob.start();
  }

  async checkRechargeStatus() {
    const activeRecharges = await this.prisma.recharge.findMany({
      where: {
        finishDateTime: {
          lte: new Date(),
        },
      },
    });

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
