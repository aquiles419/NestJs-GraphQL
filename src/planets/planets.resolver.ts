import { Resolver, Query } from '@nestjs/graphql';
import { Planet } from 'src/planets/entities/planet.entity';
import { NasaApiService } from 'src/planets/nasaApi.service';

@Resolver()
export class PlanetsResolver {
  constructor(private nasaApiService: NasaApiService) {}

  @Query(() => [Planet])
  async suitablePlanets(): Promise<any[]> {
    const response = await this.nasaApiService.getSuitablePlanets();

    if (!Array.isArray(response)) {
      throw new Error('Failed to fetch suitable planets');
    }

    return response.map((planet: any) => ({
      id: planet.pl_name,
      name: planet.pl_name,
      gravity: planet.pl_bmassj,
    }));
  }
}
