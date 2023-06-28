import { Injectable, OnModuleInit } from '@nestjs/common';
import { Recharge, Station } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

import { CronJob } from 'cron';

@Injectable()
export class RechargesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async createRecharges(data: {
    startDateTime: Date;
    finishDateTime: Date;
    userId: string;
    stationId: string;
  }): Promise<Recharge> {
    return this.prisma.recharge.create({ data });
  }

  async recharges(): Promise<Recharge[]> {
    return this.prisma.recharge.findMany();
  }

  async getRechargeById(id: string): Promise<Recharge | null> {
    return this.prisma.recharge.findUnique({ where: { id } });
  }

  async updateRecharge(
    id: string,
    data: {
      startDateTime?: Date;
      finishDateTime?: Date;
      userId?: string;
      stationId?: string;
    },
  ): Promise<Recharge | null> {
    return this.prisma.recharge.update({ where: { id }, data });
  }

  async deleteRecharge(id: string): Promise<Recharge | null> {
    return this.prisma.recharge.delete({ where: { id } });
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

    // Atualizar o status da estação para "BUSY"
    await this.updateStationStatus(stationId, 'BUSY');

    return { station, recharge };
  }

  async updateStationStatus(
    stationId: string,
    status: string,
  ): Promise<Station> {
    return this.prisma.station.update({
      where: { id: stationId },
      data: { stationStatus: status },
    });
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
          data: { stationStatus: 'AVAILABLE' },
        });
      }
    }
  }
}
