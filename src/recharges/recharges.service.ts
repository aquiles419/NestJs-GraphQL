import { Injectable, OnModuleInit } from '@nestjs/common';
import { Recharge, Station } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { RechargeCronService } from 'src/utils/recharge-cron.service';

@Injectable()
export class RechargesService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private rechargeCronService: RechargeCronService,
  ) {}

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

  onModuleInit() {
    this.rechargeCronService.startCronJob();
  }
}
