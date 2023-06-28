import { Injectable } from '@nestjs/common';
import { Station, Recharge } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

import { CreateStationInput } from './dto/create-station.input';

@Injectable()
export class StationsService {
  constructor(private prisma: PrismaService) {}

  async installStation(data: CreateStationInput): Promise<Station> {
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
}
