import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StationsService } from './stations.service';
import { Station } from './entities/station.entity';

@Resolver()
export class StationsResolver {
  constructor(private stationService: StationsService) {}

  @Mutation(() => Station)
  async installStation(
    @Args('name') name: string,
    @Args('planetName') planetName: string,
  ): Promise<Station> {
    return this.stationService.installStation({
      name,
      planetName,
      hasStation: true,
    });
  }

  @Query(() => [Station])
  async stations(): Promise<Station[]> {
    return this.stationService.stations();
  }

  @Query(() => Station, { nullable: true })
  async getStationById(@Args('id') id: string): Promise<Station | null> {
    return this.stationService.getStationById(id);
  }

  @Mutation(() => Station, { nullable: true })
  async updateStation(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('planetName') planetName: string,
    @Args('hasStation') hasStation: boolean,
  ): Promise<Station | null> {
    return this.stationService.updateStation(id, {
      name,
      planetName,
      hasStation,
    });
  }

  @Mutation(() => Station, { nullable: true })
  async deleteStation(@Args('id') id: string): Promise<Station | null> {
    return this.stationService.deleteStation(id);
  }
}
