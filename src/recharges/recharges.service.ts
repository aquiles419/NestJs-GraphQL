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

    const recharge = await this.prisma.recharge.create({
      data: {
        stationId,
        startDateTime: new Date(),
        finishDateTime,
        userId,
      },
    });

    const station = await this.prisma.station.findUnique({
      where: { id: stationId },
    });

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

  onModuleInit() {
    this.rechargeCronService.startCronJob();
  }
}
