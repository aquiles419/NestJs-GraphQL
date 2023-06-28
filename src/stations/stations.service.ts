import { Injectable, OnModuleInit } from '@nestjs/common';
import { Station, Recharge } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

import { CronJob } from 'cron';

@Injectable()
export class StationsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async installStation(data: {
    planetName: string;
    hasStation: boolean;
  }): Promise<Station> {
    return this.prisma.station.create({ data });
  }

  async stations(): Promise<Station[]> {
    return this.prisma.station.findMany();
  }

  async getStationById(id: string): Promise<Station | null> {
    return this.prisma.station.findUnique({ where: { id } });
  }

  async updateStation(
    id: string,
    data: { planetName?: string; hasStation?: boolean },
  ): Promise<Station | null> {
    return this.prisma.station.update({ where: { id }, data });
  }

  async deleteStation(id: string): Promise<Station | null> {
    return this.prisma.station.delete({ where: { id } });
  }

  async getOngoingRechargeByUser(userId: string): Promise<Recharge | null> {
    return this.prisma.recharge.findFirst({
      where: {
        userId,
        finishDateTime: {
          gt: new Date(),
        },
      },
    });
  }

  async recharge(
    stationId: string,
    finishDateTime: Date,
    userId: string,
  ): Promise<{ station: Station; recharge: Recharge }> {
    // Verificar se a estação já possui uma recarga em andamento
    const existingRecharge = await this.prisma.recharge.findFirst({
      where: {
        stationId,
        finishDateTime: {
          gt: new Date(),
        },
      },
    });
    if (existingRecharge) {
      throw new Error('Station already has an ongoing recharge.');
    }

    // Criar a recarga
    const recharge = await this.prisma.recharge.create({
      data: {
        stationId,
        startDateTime: new Date(),
        finishDateTime,
        userId,
      },
    });

    // Obter a estação pelo ID
    const station = await this.prisma.station.findUnique({
      where: { id: stationId },
    });

    // Verificar se a data de término da recarga é posterior à data atual
    if (finishDateTime > new Date()) {
      // Atualizar o status da estação para "em recarga"
      await this.prisma.station.update({
        where: { id: stationId },
        data: { hasStation: true },
      });
    } else {
      // Atualizar o status da estação para "sem recarga"
      await this.prisma.station.update({
        where: { id: stationId },
        data: { hasStation: false },
      });
    }

    return { station, recharge };
  }

  onModuleInit() {
    this.startCronJob();
  }

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
          data: { hasStation: false },
        });
      }
    }
  }
}
