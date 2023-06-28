import { Resolver, Query } from '@nestjs/graphql';
import { Planet } from 'src/planets/entities/planet.entity';
import { NasaApiService } from 'src/planets/nasaApi.service';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Resolver()
export class PlanetsResolver {
  constructor(
    private nasaApiService: NasaApiService,
    private prisma: PrismaService,
  ) {}

  @Query(() => [Planet])
  async suitablePlanets(): Promise<any> {
    const response = await this.nasaApiService.getSuitablePlanets();

    if (!Array.isArray(response)) {
      throw new Error('Failed to fetch suitable planets');
    }

    const planetPromises = response.map(async (planet: any) => {
      const station = await this.prisma.station.findFirst({
        where: { planetName: planet.pl_name },
      });
      const hasStation = !!station; // true if station exists, false if not

      return {
        name: planet.pl_name,
        mass: planet.pl_bmassj,
        hasStation,
      };
    });

    return Promise.all(planetPromises);
  }
}
