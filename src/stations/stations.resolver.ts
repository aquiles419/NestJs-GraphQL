import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StationsService } from './stations.service';
import { Station } from './entities/station.entity';
import { CreateStationInput } from './dto/create-station.input';
import { UpdateStationInput } from './dto/update-station.input';

@Resolver()
export class StationsResolver {
  constructor(private stationService: StationsService) {}

  @Mutation(() => Station)
  async installStation(
    @Args('input') input: CreateStationInput,
  ): Promise<Station> {
    const { name, planetName } = input;
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
    @Args('input') input: UpdateStationInput,
  ): Promise<Station | null> {
    const { id, name, planetName, hasStation } = input;
    return this.stationService.updateStation(id, {
      name,
      planetName,
      hasStation,
    });
  }

  @Mutation(() => Station, { nullable: true })
  async inactivateStation(
    @Args('input') input: UpdateStationInput,
  ): Promise<Station | null> {
    const { id } = input;
    return this.stationService.inactivateStation(id);
  }
}
